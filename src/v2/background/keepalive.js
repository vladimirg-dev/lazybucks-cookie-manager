import { StorageHandler } from '../storageHandler';
import { Logger } from '../logger';
import { Fetcher } from './fetcher';
import { updateData } from './uploadData';
import { install } from './init';
import { configs } from '../../configs';
import axios from 'axios';
import moment from 'moment';

export const shouldFetchKeepAlive = async () => {
    const nextKeepAliveTimestamp = await StorageHandler.getNextKeepAliveTime();
    if (nextKeepAliveTimestamp) {
        const didNextKeepAlivePass = moment(nextKeepAliveTimestamp).isSameOrBefore(moment());
        return didNextKeepAlivePass;
    } else {
        return true;
    }
};

export const keepAliveAction = async (dontSendUpdateData = false) => {
    Logger.info('Keep alive action has started');
    const profileId = await Fetcher.fetchFacebookProfileId();
    const installationId = await StorageHandler.getInstallationId();
    Logger.info(`Keep alive action will update with installationId ${installationId} and Facebook ${profileId}`);
    const keepAlive = {
        isLoggedInToFacebook: profileId ? true : false,
        facebookProfileId: profileId,
        installationId,
        extensionVersion: chrome.runtime.getManifest().version,
        extensionName: chrome.runtime.getManifest().name,
    };
    try {
        const res = await axios.post(`${configs.API}/extension/keepalive`, keepAlive);
        Logger.info('Keep alive has update has completed');
        const nextKeepAlive = res.data.nextKeepAlive;
        Logger.info(`nextKeepAlive: ${nextKeepAlive}`);
        await StorageHandler.saveNextKeepAliveTime(nextKeepAlive);
        if (!dontSendUpdateData) {
            if (res.data.shouldUpdateData) {
                Logger.info('Keep alive has detected dataupdate request');
                await updateData();
            }
        } else {
            Logger.info('Send data was aborted due to dontSendUpdateData flag');
        }
    } catch (error) {
        if (error.response.status === 401) {
            Logger.log('Extension id not found running install');
            await install();
        } else {
            Logger.log(error);
        }
    }
};
