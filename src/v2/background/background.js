import { Logger } from '../logger';
import { sleep } from './sleep';
import { safeInit, isConsentAccepted } from './init';
import { shouldFetchKeepAlive, keepAliveAction } from './keepalive';

async function start() {
    await safeInit();
    while (true) {
        try {
            const consentAccepted = await isConsentAccepted();
            if (consentAccepted) {
                const shouldKeepAlive = await shouldFetchKeepAlive();
                if (shouldKeepAlive) {
                    await keepAliveAction();
                }
                await sleep(1000);
            }
        } catch (err) {
            Logger.error(err);
        }
    }
}

start().catch((err) => Logger.error(err));
