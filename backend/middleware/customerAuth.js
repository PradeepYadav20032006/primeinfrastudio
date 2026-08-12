const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const Customer = require('../models/Customer');

// Protect routes that require a logged-in customer (not admin/editor).
// Checks the token's `type` claim to make sure an admin token can't be
// reused to access customer-only routes, and vice versa.
const protectCustomer = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.customerToken) {
    token = req.cookies.customerToken;
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, please log in');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.type !== 'customer') {
      res.status(401);
      throw new Error('Not authorized for this resource');
    }
    req.customer = await Customer.findById(decoded.id);
    if (!req.customer || !req.customer.isActive) {
      res.status(401);
      throw new Error('Not authorized, account not found or inactive');
    }
    next();
  } catch (error) {
    res.status(401);
    throw new Error('Not authorized, token failed or expired');
  }
});

// Optional customer auth: attaches req.customer if a valid customer token is
// present, but does NOT fail the request if there's no token. Used on public
// endpoints (quote/contact submission) so we can link a submission to a
// logged-in customer's account without requiring login to use those forms.
const attachCustomerIfPresent = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) return next();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.type === 'customer') {
      const customer = await Customer.findById(decoded.id);
      if (customer && customer.isActive) req.customer = customer;
    }
  } catch (error) {
    // Invalid/expired token on a public route - just proceed as a guest.
  }
  next();
};

module.exports = { protectCustomer, attachCustomerIfPresent };
