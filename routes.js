var homePage = require('./controllers/home-page');
var doubleElevenPage = require('./controllers/double-eleven-page');
var doubleElevenStoragePeriod = require('./controllers/double-eleven-storage-period');

exports.setup = function setup(app) {
  app.get('/', homePage.index);
  app.get('/homePage', homePage.index);
  app.get('/doubleElevenPage', doubleElevenPage.index);
  app.get('/doubleElevenStoragePeriod', doubleElevenStoragePeriod.index);
};
