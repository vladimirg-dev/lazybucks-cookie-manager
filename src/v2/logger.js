export class Logger {
    static debug(...args) {
        console.debug(...args);
    }

    static log(...args) {
        console.log(...args);
    }

    static error(...args) {
        console.error(...args);
    }

    static info(...args) {
        console.info(...args);
    }
}