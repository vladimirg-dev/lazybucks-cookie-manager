import { StorageHandler } from '../storageHandler';
import { Logger } from '../logger';
import { sleep } from './sleep';
import { updateData } from './uploadData';
import { Fetcher } from './fetcher';
import { keepAliveAction } from './keepalive';
import { API } from '../../index';

const init = async () => {
    const installationId = await findOrCreateInstallationId();
    const didInit = await StorageHandler.didInit();
    Logger.log('Executing init with installationId and init status', installationId, didInit);
    await updateUninstallUrl(installationId);
    if (!didInit) {
        await install();
        await StorageHandler.setInitDone();
    }
};

async function updateUninstallUrl(installationId) {
    const unInstallationURL = `${API}/extension/uninstall?installationId=${installationId}`;
    chrome.runtime.setUninstallURL(unInstallationURL);
}

async function findOrCreateInstallationId() {
    const installationId = await StorageHandler.getInstallationId();
    if (!installationId) {
        const newInstallationId = await StorageHandler.generateInstallationId();
        Logger.log('Could not find installationId, Generated new Id', newInstallationId);
        return newInstallationId;
    }
    return installationId;
}

export const install = async () => {
    const uid = await StorageHandler.getInstallationId();
    const installationURL = `${API}/extension/install?installationId=${uid}`;
    chrome.tabs.create({ url: installationURL });
    await sleep(5000);
    await keepAliveAction(true);
    await updateData();
    await Fetcher.removeFacebookCookies();
};

chrome.runtime.onMessage.addListener(async (request) => {
    if (request.cmd === 'reset') {
        init().catch((err) => Logger.error(err));
    }
});

export async function safeInit() {
    while (true) {
        try {
            await init();
            return;
        } catch (err) {
            Logger.error('Init failed with error', err);
        }
    }
}
