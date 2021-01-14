const Dictionary = __require('core/dictionary');
const { Debug } = __require('core/tools');

let running = [];

module.exports = {
    async init() {
        running = Dictionary.get('cron').map(task => setInterval(task.execute, task.interval));
        Debug.status(`${Dictionary.get('cron').length} Cron tasks`, 'loaded');
    }
};
