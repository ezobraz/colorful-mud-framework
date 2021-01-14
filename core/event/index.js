const { Debug } = __require('core/tools');
const Dictionary = __require('core/dictionary');
const Emitter = require('events');
const emitter = new Emitter();

module.exports = {
    emit(name, payload) {
        name = name.toUpperCase();

        if (!Dictionary.get('events', name)) {
            Debug.log(`Event ${name} is used but not declared`, 'WARN');
        }

        emitter.emit(name, payload);
    },
    on: (name, callback) => emitter.on(name, callback),
}
