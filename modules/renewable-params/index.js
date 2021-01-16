const Store = __require('core/store');

module.exports = {
    cron: [
        {
            interval: 10000,
            execute() {
                Store.get('players').forEach(ply => {
                    if (ply.meta.class) {
                        const health = ply.params.find(el => el.class.toLowerCase() == 'health');

                        if (health) {
                            const bit = health.bit(ply);
                            const max = health.max(ply);
                            const level = health.level;

                            if (level < max) {
                                let add = bit;

                                if (level + add > max) {
                                    add = max - level;
                                }

                                health.level += add;
                                ply.save();
                            }
                        }
                    }
                });
            },
        },
    ],
};
