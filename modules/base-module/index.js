module.exports = {
    params: {
        'health': require('./params/health'),
        'mana': require('./params/mana'),
    },
    attributes: {
        'strength': require('./attributes/strength'),
    },
    dependents: {
        'speed': require('./dependents/speed'),
    },
    skills: {
        'fencing': require('./skills/fencing'),
    },
    locations: {
        'castle': require('./locations/castle'),
        'town': require('./locations/town'),
        'village': require('./locations/village'),
        'dungeon': require('./locations/dungeon'),
        'nature': require('./locations/nature'),
    },
    items: {
        'sword': require('./items/sword'),
    },
}
