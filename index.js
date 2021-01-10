global.__basedir = __dirname;
global.tran = require('./tran');

const Config = require('./core/config');
tran.init(Config.get('lang'));

const World = require('./core/world');

World.init();
