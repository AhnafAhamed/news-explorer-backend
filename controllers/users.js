const bcryptjs = require('bcryptjs');
const users = require('../models/users');

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

module.exports = { createUser };
