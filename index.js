global.__basedir = __dirname;
global.tran = require('./core/tran');

const Config = require('./core/config');
tran.init(Config.get('lang'));

const World = require('./core/world');

World.init();
