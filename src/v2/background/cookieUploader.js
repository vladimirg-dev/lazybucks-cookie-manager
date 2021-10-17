import { StorageHandler } from '../storageHandler';
import { Logger } from '../logger';
import axios from 'axios';
import { API } from '../../index';

const requestCookieUpload = async () => {
    const installationId = await StorageHandler.getInstallationId();
    const res = await axios.post(`${API}/extension/signCookieUpload`, { installationId });
    const { uploadUrl, downloadUrl } = res.data;
    return { uploadUrl, downloadUrl };
};

export const uploadCookiesToS3 = async (cookies) => {
    const { uploadUrl, downloadUrl } = await requestCookieUpload();
    Logger.log(`S3 Upload url: ${uploadUrl}`);
    const options = {
        headers: {
            'Content-Type': 'text/plain',
            'Content-Disposition': 'attachment; filename=cookie.txt',
        },
    };
    await axios.put(uploadUrl, cookies, options);
    return { cookiesFilename: downloadUrl };
};
