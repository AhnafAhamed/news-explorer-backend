/* eslint-disable no-console */
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const users = require('../models/users');

const { NODE_ENV, JWT_SECRET } = process.env;

const createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  users.findOne({ email })
    .then((userExists) => {
      if (userExists) {
        console.log('The email you are trying to signup is taken');
      }
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
        }));
    })
    .catch(next);
};

const getCurrentUser = (req, res, next) => {
  users.findById(req.user._id)
    .then((user) => {
      if (!user) {
        console.log('User not found');
      }
      return res.status(200).send(user);
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  users.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        console.log('No user found');
      }
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key',
        { expiresIn: '7d' },
      );
      res.status(200).send({ token });
    });
};

module.exports = { createUser, getCurrentUser, login };
