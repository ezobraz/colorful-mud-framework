global.__basedir = __dirname;
global.tran = require('./tran');

const Config = require('./src/config');
tran.init(Config.get('lang'));

const World = require('./src/world');

World.init();
