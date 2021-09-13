const enabled = process.env.LOGS_ENABLED ? process.env.LOGS_ENABLED : true;
export class Logger {
    static debug(...args) {
        enabled && console.debug(...args);
    }

    static log(...args) {
        enabled && console.log(...args);
    }

    static error(...args) {
        enabled && console.error(...args);
    }

    static info(...args) {
        enabled && console.info(...args);
    }
}