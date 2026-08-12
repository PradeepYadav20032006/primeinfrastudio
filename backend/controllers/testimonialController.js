const Testimonial = require('../models/Testimonial');
const crudFactory = require('./crudFactory');

module.exports = crudFactory(Testimonial, {
  searchFields: ['clientName', 'message', 'projectType'],
});
