import { StorageHandler } from '../storageHandler';
import axios from 'axios';

export const handleIconUpdate = async () => {
    const uid = await StorageHandler.getInstallationId();
    try {
        const { data } = await axios.get(`${process.env.API_URL}/extension/info?installationId=${uid}`);
        const { userStatus, facebookStatus } = data;
        if (userStatus === 'ACTIVE' && facebookStatus === 'LOGGED_IN') {
            chrome.browserAction.setIcon({ path: './icon32.png' });
        } else {
            chrome.browserAction.setIcon({ path: './icon32.png' });
        }
    } catch (err) {
        debugger;
        const isNotFoundExtensionError = err && err.response && err.response.status === 404 && err.response.data.message === 'Extension id was not found';
        if (isNotFoundExtensionError) {
            await StorageHandler.clearInstallationId();
            throw err;
        } else {
            throw err;
        }
    }
};
