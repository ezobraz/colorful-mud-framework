global.__basedir = __dirname;
global.__require = parh => require(__dirname + '/' + parh);
global.tran = require('./core/tran');

const Config = require('./core/config');
tran.init(Config.get('lang'));

const World = require('./core/world');

World.init();
