global.__basedir = __dirname;
global.tran = require('./tran');

tran.init('ru');

const World = require('./src/world');

World.init();
