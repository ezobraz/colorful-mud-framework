module.exports = {
    name: 'Warrior',
    desc: 'Strong and fast warrior',
    params: [
        ['health', 1],
        ['endurance', 0],
    ],
    dependents: [
        'speed',
    ],
    attributes: [
        ['strength', 1],
    ],
};
