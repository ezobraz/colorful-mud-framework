const Dependent = __require('core/entities/dependent/base');

/**
* Speed Dependent
*
* @memberof Dependents
*/
class Speed extends Dependent {
    level(player) {
        return 15;
    }
};

module.exports =  Speed;
