const { Debug } = __require('core/tools');

module.exports = {
    cron: [
        {
            interval: 60000,
            execute() {
                let usedMb = process.memoryUsage().heapUsed / 1024 / 1024;
                let used = Math.round(usedMb * 100) / 100;

                Debug.status('Ram usage', `${used} mb`);
            },
        },
    ],
}
