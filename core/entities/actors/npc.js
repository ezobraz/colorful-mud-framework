const Actor = require('./base');

/**
* NPC
*
* @memberof Actors
*/
class Npc extends Actor {
    get displayName() {
        let res = super.displayName;
        let className = tran.slate(`actor-class-${this.class.toLowerCase()}`);

        return `[${className}] ${res}`;
    }
};

module.exports = Npc;
