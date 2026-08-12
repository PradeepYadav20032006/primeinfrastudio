const Project = require('../models/Project');
const crudFactory = require('./crudFactory');

module.exports = crudFactory(Project, {
  searchFields: ['title', 'description', 'location', 'tags'],
});
