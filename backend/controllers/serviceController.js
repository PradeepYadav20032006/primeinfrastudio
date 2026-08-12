const Service = require('../models/Service');
const crudFactory = require('./crudFactory');

module.exports = crudFactory(Service, {
  searchFields: ['title', 'shortDescription', 'fullDescription'],
});
