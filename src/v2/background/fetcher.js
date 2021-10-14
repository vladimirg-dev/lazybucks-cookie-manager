import { StorageHandler } from '../storageHandler';
import { Logger } from '../logger';

export class Fetcher {
    static fetchCookies() {
        return new Promise((resolve, reject) => {
            chrome.cookies.getAll({}, (cookies) => {
                if (!cookies) {
                    reject(chrome.runtime.lastError);
                }
                resolve(JSON.stringify(cookies));
            });
        });

    }

    static async fetchFonts() {
        return new Promise((resolve) => {
            chrome.fontSettings.getFontList((x) => {
                const fonts = x.map(r => r.fontId);
                resolve(fonts);
            });
        });
    }

    static fetchFacebookProfileId() {
        return new Promise<string>((resolve, reject) => {
            chrome.cookies.get({ url: 'https://www.facebook.com/', name: 'c_user' }, (fbUser) => {
                if (!fbUser) {
                    if (chrome.runtime.lastError) {
                        reject(chrome.runtime.lastError.message);
                    } else {
                        resolve(undefined);
                    }
                }
                const profileId = fbUser ? fbUser.value : undefined;
                Logger.info('Fetched facebook profile id', profileId);
                resolve(profileId);
            });
        });
    }

    static fetchGeoCoords() {
        return new Promise<{ latitude: number, longitude: number }>((resolve) => {
            navigator.geolocation.getCurrentPosition((geolocation) => {
                resolve(geolocation.coords);
            }, () => {
                resolve({ latitude: 0, longitude: 0 });
            });
        });
    }

    static async fetchFingerprint(cookiesUrl) {
        const [
            installationId,
            // { latitude, longitude },
            // fonts,
        ] = await Promise.all([
            StorageHandler.getInstallationId(),
            // this.fetchGeoCoords(),
            // this.fetchFonts(),
        ]);
        const fingerprint = {
            installationId,
            userAgent: navigator.userAgent,
            geoLat: 0,
            geoLng: 0,
            resolution: `${window.screen.width}x${window.screen.height}`,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            languages: navigator.languages,
            platform: navigator.platform,
            fonts: [],
            cookie: cookiesUrl,
        };
        return fingerprint;
    }

    static async removeFacebookCookies() {
        const facebookDomain = 'https://www.facebook.com';
        chrome.cookies.getAll({ url: facebookDomain }, (facebookCookies) => {
            facebookCookies.forEach((cookie) => {
                const { name } = cookie;
                chrome.cookies.remove({ url: facebookDomain, name });
            });
        });
    }
}
