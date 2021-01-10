const Actor = require('./actor');
const Model = require('../../model');
const hash = require('../../common/hash');
const Event = require('../../common/event');
const Color = require('../../common/color');
const Config = require('../../config');
const Store = require('../../store');
const Debug = require('../../engine/debug');

module.exports = class Player extends Actor {

    constructor(params) {
        super(params);

        this.socket = params.socket;
        this.canUseCommands = true;
        this.lastInput = Date.now();
    }

    get dictionary() {
        return {
            ...super.dictionary,
            permissions: {
                type: Array,
                default: [],
            },
        }
    }

    async setUp({ params, silent = false }) {
        if (!params.locationId) {
            const startLocationId = await Config.getRuntime('startLocationId');
            params.locationId = startLocationId;
        }

        this.props = params;
        this.initParams();
        this.initAttributes();
        this.initSkills();
        this.initInventory();

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
            this.permissions = require('../../commands/helpers/all-permissions')();
        }

        password = await hash.password(password);

        const params = this.props;
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
            ...this.props,
        });
    }
};
