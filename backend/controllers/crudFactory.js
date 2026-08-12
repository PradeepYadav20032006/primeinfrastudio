const asyncHandler = require('express-async-handler');

/**
 * Generates standard CRUD handlers for a given Mongoose model.
 * Keeps controllers for Project, Service, Gallery, Blog, Testimonial consistent and DRY.
 *
 * @param {mongoose.Model} Model
 * @param {Object} options
 * @param {string[]} options.searchFields - fields to run a regex search across
 * @param {string} options.populate - optional field to populate on getAll/getOne
 */
const crudFactory = (Model, options = {}) => {
  const { searchFields = [], populate = '' } = options;

  // GET /api/<resource>  (supports ?category=&status=&featured=&search=&page=&limit=&sort=)
  const getAll = asyncHandler(async (req, res) => {
    const { search, page = 1, limit = 12, sort = '-createdAt', ...filters } = req.query;

    // Remove empty/undefined filter values
    Object.keys(filters).forEach((key) => {
      if (filters[key] === undefined || filters[key] === '') delete filters[key];
    });

    let query = { ...filters };

    if (search && searchFields.length) {
      query.$or = searchFields.map((field) => ({ [field]: { $regex: search, $options: 'i' } }));
    }

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.max(parseInt(limit, 10) || 12, 1);
    const skip = (pageNum - 1) * limitNum;

    let mongooseQuery = Model.find(query).sort(sort).skip(skip).limit(limitNum);
    if (populate) mongooseQuery = mongooseQuery.populate(populate);

    const [items, total] = await Promise.all([mongooseQuery, Model.countDocuments(query)]);

    res.status(200).json({
      success: true,
      count: items.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: items,
    });
  });

  // GET /api/<resource>/:idOrSlug
  const getOne = asyncHandler(async (req, res) => {
    const { idOrSlug } = req.params;
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(idOrSlug);
    let query = Model.findOne(isObjectId ? { _id: idOrSlug } : { slug: idOrSlug });
    if (populate) query = query.populate(populate);
    const item = await query;

    if (!item) {
      res.status(404);
      throw new Error(`${Model.modelName} not found`);
    }
    res.status(200).json({ success: true, data: item });
  });

  // POST /api/<resource>
  const createOne = asyncHandler(async (req, res) => {
    const item = await Model.create(req.body);
    res.status(201).json({ success: true, data: item });
  });

  // PUT /api/<resource>/:id
  const updateOne = asyncHandler(async (req, res) => {
    const item = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) {
      res.status(404);
      throw new Error(`${Model.modelName} not found`);
    }
    res.status(200).json({ success: true, data: item });
  });

  // DELETE /api/<resource>/:id
  const deleteOne = asyncHandler(async (req, res) => {
    const item = await Model.findByIdAndDelete(req.params.id);
    if (!item) {
      res.status(404);
      throw new Error(`${Model.modelName} not found`);
    }
    res.status(200).json({ success: true, data: {} });
  });

  return { getAll, getOne, createOne, updateOne, deleteOne };
};

module.exports = crudFactory;
