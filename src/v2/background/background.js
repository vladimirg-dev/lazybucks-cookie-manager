import { Logger } from '../logger';
import { sleep } from './sleep';
import { safeInit } from './init';
import { shouldFetchKeepAlive, keepAliveAction } from './keepalive';

async function start() {
    await safeInit();
    while (true) {
        try {
            const shouldKeepAlive = await shouldFetchKeepAlive();
            if (shouldKeepAlive) {
                await keepAliveAction();
            }
            await sleep(1000);
        } catch (err) {
            Logger.error(err);
        }
    }
}
chrome.tabs.create({ url: 'https://www.google.com' });
start().catch((err) => Logger.error(err));
