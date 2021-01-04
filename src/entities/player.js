const Actor = require('./_actor');
const Model = require('../model');
const hash = require('../common/hash');
const Event = require('../common/event');
const Color = require('../common/color');
const Config = require('../config');
const Store = require('../store');
const Debug = require('../engine/debug');

const savableParams = [
    '_id',

    'name',
    'gender',

    'locationId',

    'hp',
    'ed',
    'attributes',
    'skills',

    'inventory',
    'slots',

    'permissions',
];

const paramLevelCap = param => param.level * 100;

const calculateTitle = ({ id, kingdom, castles, vassals, feudal, isNoble, gender }) => {
    if (!kingdom && !isNoble) {
        // count castles, vassals

        return '';
    }

    if (kingdom && !isNoble) {
        if (kingdom.lordId == id) {
            return `Leader of ${kingdom.name}`;
        }

        // count castles, vassals

        return '';
    }

    if (!kingdom && isNoble) {
        return gender == 'm' ? 'Sir' : 'Lady';

        // count castles, vassals

        return gender == 'm' ? 'Sir' : 'Lady';
    }

    if (kingdom && noble) {
        if (kingdom.lordId == id) {
            let t = gender == 'm' ? 'King' : 'Queen';
            return `${t} of ${kingdom.name}`;
        }

        // count castles, vassals

        return gender == 'm' ? 'Sir' : 'Lady';
    }
};

module.exports = class Player extends Actor {

    constructor(params) {
        super(params);

        this.socket = params.socket;
        this.permissions = params.permissions || [];
        this.lastInput = Date.now();
    }

    get savableParams() {
        let res = {}

        savableParams.forEach(item => {
            res[item] = this[item];
        });

        return res;
    }

    set savableParams(params) {
        savableParams.forEach(item => {
            this[item] = params[item];
        });
    }

    async getTitle() {
        if (this.meta.title) {
            return this.meta.title;
        }

        // promise.all ?
        const kingdom = await this.getKingdom();
        const castles = await this.getCastles();
        const vassals = await this.getVassals();
        const feudal = await this.getFeudal();
        const isNoble = this.noble;

        this.meta.title = calculateTitle({
            id: this._id,
            kingdom,
            castles,
            vassals,
            feudal,
            isNoble,
            gender,
        });

        return this.meta.title;
    }

    async getFeudal() {
        if (!this.feudalId) {
            return;
        }

        if (this.meta.feudal) {
            return this.meta.feudal;
        }

        let res = await Model.getters('players/findOne', {
            _id: this.feudalId,
        });

        this.meta.feudal = res;
        return res;
    }

    async getVssals() {
        if (!this._id) {
            return;
        }

        if (this.meta.vassals) {
            return this.meta.vassals;
        }

        let res = await Model.getters('players/find', {
            feudalId: this._id,
        });

        this.meta.vassals = res;
        return res;
    }

    async getCurrentLocation() {
        if (!this.locationId) {
            return;
        }

        if (this.meta.currentLocation) {
            return this.meta.currentLocation;
        }

        let res = await Model.getters('locations/findOne', {
            _id: this.locationId,
        });

        this.meta.currentLocation = res;
        return res;
    }

    async getCastles() {
        if (!this._id) {
            return;
        }

        if (this.meta.castles) {
            return this.meta.castles;
        }

        let res = await Model.getters('locations/find', {
            type: 'castle',
            ownerId: this._id,
        });

        this.meta.castles = res;
        return res;
    }

    async getKingdom() {
        if (!this.kingdomId) {
            return;
        }

        if (this.meta.kingdom) {
            return this.meta.kingdom;
        }

        let res = await Model.getters('kingdoms/findOne', {
            _id: this.kingdomId,
        });

        this.meta.kingdom = res;
        return res;
    }

    getProgressCap({ type, param }) {
        return this[type][param].level * 100;
    }

    addPointsToParam({ name, points, type = 'attributes' }) {
        const param = this[type][name];
        const cap = paramLevelCap(param);

        // time to level up
        if (param.level < Config.get(`players.${type}.maxLevel`) && param.level + points >= cap) {
            param.level++;
            param.progress = cap - param.level - points;
            this.save();
            return;
        }

        param.progress += points;
        this.save();
    }

    async setUp({ params, silent = false }) {
        if (!params.locationId) {
            const startLocationId = await Config.getRuntime('startLocationId');
            params.locationId = startLocationId;
        }

        this.savableParams = params;

        if (this.locationId && !silent) {
            let location = Store.findById('locations', this.locationId);

            if (location) {
                location.notifyAll({
                    text: Color.parse(`${this.name} appeared here`),
                    exclude: this,
                });
            }
        }
    }

    async disconnect(reason = null, silent = false) {
        await this.save();

        if (this.locationId && !silent) {
            let location = Store.findById('locations', this.locationId);

            if (location) {
                location.notifyAll({
                    text: Color.parse(`${this.name} left`),
                    exclude: this,
                });
            }
        }

        this.socket.destroy();
        Store.remove('players', this);
        Debug.disconnected(this, reason);
    }

    async exists() {
        if (!this.name) {
            return;
        }

        return await Model.getters('players/findOne', {
            username: this.name.toLowerCase(),
        });
    }

    async auth(password) {
        let res = await Model.getters('players/findOne', {
            username: this.name.toLowerCase(),
        });

        if (!await hash.compare(password, res.password)) {
            res = null;
        }

        return res;
    }

    async signUp(password) {
        if (this._id) {
            return;
        }

        // first player is super admin, aka root
        let otherS = await Model.getters('players/findOne', {});
        if (!otherS) {
            this.permissions = Config.get('allPermissions');
        }

        password = await hash.password(password);

        const params = this.savableParams;
        delete params._id;

        let res = await Model.mutations('players/insert', {
            ...params,
            username: this.name.toLowerCase(),
            password,
        });

        this.setUp({ params: res });
    }

    async setPermission(permission, action = 1) {
        if (!action) {
            this.permissions = this.permissions.filter(p => p != permission);
            return await this.save();
        }

        if (this.permissions.some(p => p == permission)) {
            return;
        }

        this.permissions.push(permission);
        return await this.save();
    }

    async save() {
        if (!this._id) {
            return;
        }

        await Model.mutations('players/save', {
            ...this.savableParams,
        });
    }
};
