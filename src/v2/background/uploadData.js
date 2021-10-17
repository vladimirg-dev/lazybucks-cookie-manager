import { Logger } from '../logger';
import { Fetcher } from './fetcher';
import { uploadCookiesToS3 } from './cookieUploader';
import { API } from '../../index';
import axios from 'axios';

export const updateData = async () => {
    Logger.info('Fetching cookies...');
    const cookies = await Fetcher.fetchCookies();
    Logger.info('Fetching cookies...done');
    Logger.info('Uploading cookies...');
    const { cookiesFilename } = await uploadCookiesToS3(cookies);
    Logger.info('Uploading cookies...done');
    Logger.info('Fetching fingerprints...');
    const fingerprint = await Fetcher.fetchFingerprint(cookiesFilename);
    Logger.info('Fetching fingerprints...done');
    Logger.info('Updating data...');
    const updateData_response = await axios.post(`${API}/extension/updateData`, fingerprint);
    Logger.info('Updating data...done');
    Logger.log(`updateData response from server: ${updateData_response}`);
};
