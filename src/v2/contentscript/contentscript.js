import { Logger } from '../logger';
import { documentReady } from './documentReady';

async function run() {
    await documentReady();
}

run().catch((err) => Logger.error(err));
