var doubleElevenPage = require('./controllers/double-eleven-page');
var doubleElevenStoragePeriod = require('./controllers/double-eleven-storage-period');

exports.setup = function setup(app) {
  app.get('/', doubleElevenPage.index);
  app.get('/doubleElevenPage', doubleElevenPage.index);
  app.get('/doubleElevenStoragePeriod', doubleElevenStoragePeriod.index);
};
