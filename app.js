/* eslint-disable no-console */
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const { errors, Joi, celebrate } = require('celebrate');
const { createUser, login } = require('./controllers/users');
const users = require('./routes/users');
const articles = require('./routes/articles');
const auth = require('./middleware/auth');
const { requestLogger, errorLogger } = require('./middleware/logger');
const NotFoundError = require('./errors/not-found-error');
const limiter = require('./helpers/limiter');

const { PORT = 3000, NODE_ENV, MONGO_URL } = process.env;

const app = express();

require('dotenv').config();

mongoose.connect(NODE_ENV === 'production' ? MONGO_URL : 'mongodb://localhost:27017/news-explorer', {
  useNewUrlParser: true,
});

app.use(express.json());

app.use(cors());
app.options('*', cors());
app.use(helmet());
app.use(requestLogger);
app.use(limiter);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.use(auth);

app.use('/', users);
app.use('/', articles);

app.get('*', () => {
  throw new NotFoundError('Requested resource not found');
});

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'An error occurred on the server'
        : message,
    });
  next();
});

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
