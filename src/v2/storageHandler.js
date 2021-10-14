import { Logger } from './logger';
const uuidv1 = require('uuid/v1');

export class StorageHandler {
    static getInstallationId() {
        return new Promise<string>((resolve, reject) => {
            chrome.storage.local.get('installationId', (result) => {
                const installationId = result.installationId;
                Logger.info('getInstallationId - resolved with', installationId);
                return resolve(installationId);
            });
        });
    }

    static didInit() {
        return new Promise<boolean>((resolve, reject) => {
            chrome.storage.local.get('initDone', (result) => {
                const initDone = !!result.initDone;
                Logger.info('didInitDone - resolved with', initDone);
                return resolve(initDone);
            });
        });
    }

    static async clearInstallationId() {
        await new Promise<boolean>((resolve, reject) => {
            chrome.storage.local.set({ initDone: false }, () => {
                Logger.info('setInitDone - false');
                return resolve(true);
            });
        });
        await new Promise((resolve, reject) => {
            chrome.storage.local.set({ installationId: null }, () => {
                Logger.info('clear Installation Id');
                resolve();
            });
        });
    }

    static setInitDone() {
        return new Promise<boolean>((resolve, reject) => {
            chrome.storage.local.set({ initDone: true }, () => {
                Logger.info('setInitDone - true');
                return resolve(true);
            });
        });
    }

    static generateInstallationId() {
        return new Promise<string>((resolve, reject) => {
            const installationId = uuidv1();
            chrome.storage.local.set({ installationId }, () => {
                Logger.info('generateInstallationId - resolved with', installationId);
                return resolve(installationId);
            });
        });
    }

    static async resetLocalStorage() {
        await new Promise((resolve, reject) => {
            chrome.storage.local.clear(() => {
                return resolve();
            });
        });
    }

    static async reset() {
        await this.resetLocalStorage();
        chrome.extension.getViews().forEach((v) => v.close());
    }

    static async saveNextKeepAliveTime(nextKeepAliveTime) {
        await new Promise<string>((resolve, reject) => {
            chrome.storage.local.set({ nextKeepAliveTime }, () => {
                Logger.info(`next keep alive fetch time has been set to ${nextKeepAliveTime}`);
                return resolve(nextKeepAliveTime);
            });
        });
    }

    static async getNextKeepAliveTime() {
        return new Promise<Date>((resolve, reject) => {
            chrome.storage.local.get('nextKeepAliveTime', (result) => {
                if (result && result.nextKeepAliveTime) {
                    const nextKeepAliveTime = result.nextKeepAliveTime;
                    const nextKeepAlive = new Date(nextKeepAliveTime);
                    if (!Number.isNaN(nextKeepAlive.getTime())) {
                        resolve(nextKeepAlive);
                        return;
                    }
                }
                resolve(null);
            });
        });
    }

    static setConsentStatus(status) {
        return new Promise<boolean>((resolve, reject) => {
            chrome.storage.local.set({ consentStatus: status }, () => {
                Logger.info('set consentStatus: ', status);
                return resolve(true);
            });
        });
    }

    static getConsentStatus() {
        return new Promise<boolean>((resolve, reject) => {
            chrome.storage.local.get('consentStatus', (result) => {
                const consentStatus = result.consentStatus;
                Logger.info('get consentStatus: ', consentStatus);
                return resolve(consentStatus);
            });
        });
    }
}
