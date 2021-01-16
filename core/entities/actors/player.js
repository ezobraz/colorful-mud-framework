const Actor = require('./base');
const Model = __require('core/model');
const Store = __require('core/store');
const { Color, Hash, Debug } = __require('core/tools');

/**
* Player
*
* @memberof Actors
*/
class Player extends Actor {
    constructor(params) {
        super(params);
        this.socket = params.socket;
        this.lastInput = Date.now();
    }

    /**
     * If false, user will be limited to "quit" command
     *
     * @type {Boolean}
     */
    canUseCommands = true

    get props() {
        const res = {...this};

        delete res.tmp;
        delete res.socket;
        delete res.canUseCommands;
        delete res.lastInput;

        return res;
    }

    /**
     * Get player Gm level
     *
     * @return {Number}
     */
    get isGm() {
        if (this.permissions && this.permissions.length > 0) {
            const allPermissions = require('../../commands/helpers/all-permissions')();

            if (this.permissions.length < allPermissions) {
                return 1;
            }

            return 2;
        }

        return 0;
    }

    /**
     * Get player color based on his gm leve
     *
     * @return {String}
     * @default 'cW'
     */
    get color() {
        if (this.permissions && this.permissions.length > 0) {
            const allPermissions = require('../../commands/helpers/all-permissions')();

            if (this.permissions.length < allPermissions) {
                return 'cY';
            }

            return 'cR';
        }

        return 'cW';
    }

    /**
     * Save & Disconnect user from the server
     *
     * @param {String} reason
     * @param {Boolean} silent Notify nearby players or not?
     */
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

    /**
     * Check if player with this name already exists in the Database
     *
     * @return {Object} user data
     */
    async exists() {
        if (!this.name) {
            return;
        }

        return await Model.getters('players/findOne', {
            username: this.name.toLowerCase(),
        });
    }

    /**
     * Sign in user with login and password
     *
     * @param {String} password
     * @return {Object} user data
     */
    async signIn(password) {
        let res = await Model.getters('players/findOne', {
            username: this.name.toLowerCase(),
        });

        if (!await Hash.compare(password, res.password)) {
            res = null;
        }

        return res;
    }

    /**
     * Sign up user with login and password
     *
     * @param {String} password
     */
    async signUp(password) {
        if (this._id) {
            return;
        }

        // first player is super admin, aka root
        let otherS = await Model.getters('players/findOne', {});
        if (!otherS) {
            this.permissions = require('../../commands/helpers/all-permissions')();
        }

        password = await Hash.password(password);

        const params = this.props;
        delete params._id;

        let res = await Model.mutations('players/insert', {
            ...params,
            username: this.name.toLowerCase(),
            password,
        });

        return res;
    }

    /**
     * Add or remove permission to user
     *
     * @param {String} permissionName
     * @param {Boolean} action true - add, false - remove
     */
    async setPermission(permission, action = false) {
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

    /**
     * Save user in the Database
     *
     */
    async save() {
        if (!this._id) {
            return;
        }

        await Model.mutations('players/save', {
            ...this.props,
        });
    }
};

module.exports = Player;
