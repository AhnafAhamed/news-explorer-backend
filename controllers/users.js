/* eslint-disable no-console */
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const users = require('../models/users');
const ConflictError = require('../errors/conflict-error');
const BadRequestError = require('../errors/bad-request-error');
const AuthorizationError = require('../errors/auth-error');

const { NODE_ENV, JWT_SECRET } = process.env;

const createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  bcryptjs
    .hash(password, 10)
    .then((hash) => users.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => res.status(200).send({
      name: user.name,
      email: user.email,
    }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return next(new BadRequestError('Validation Error'));
      }
      if (error.code === 11000) {
        return next(new ConflictError('Conflict Error'));
      }
      return next(error);
    })
    .catch(next);
};

const getCurrentUser = (req, res, next) => {
  users
    .findById(req.user._id)
    .then((user) => res.status(200).send(user))
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  users.findUserByCredentials(email, password).then((user) => {
    const token = jwt.sign(
      { _id: user._id },
      NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key',
      { expiresIn: '7d' },
    );
    res.status(200).send({ token });
  })
    .catch(() => next(new AuthorizationError('Invalid credentials')));
};

module.exports = { createUser, getCurrentUser, login };
