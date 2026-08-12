const Gallery = require('../models/Gallery');
const crudFactory = require('./crudFactory');

module.exports = crudFactory(Gallery, {
  searchFields: ['title', 'category'],
  populate: 'project',
});
