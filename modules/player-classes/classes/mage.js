module.exports = {
    name: 'Mage',
    desc: 'Control the power of magic!',
    stats: {
        attributes: {
            strength: {
                level: 1,
            },
        },
        params: {
            health: { level: 1 },
            mana: { level: 0 },
        },
        skills: {
            fencing: { level: 1 },
        },
        dependents: {
            speed: true,
        },
    },
};
