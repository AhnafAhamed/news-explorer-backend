/* eslint-disable no-console */
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const { errors } = require('celebrate');
const { createArticle } = require('./controllers/articles');
const { createUser, login } = require('./controllers/users');
const users = require('./routes/users');
const articles = require('./routes/articles');
const auth = require('./middleware/auth');
const { requestLogger, errorLogger } = require('./middleware/logger');
const NotFoundError = require('./errors/not-found-error');

const { PORT = 3000 } = process.env;

const app = express();

require('dotenv').config();

mongoose.connect('mongodb://localhost:27017/news-explorer', {
  useNewUrlParser: true,
}).then(() => {
  console.log('DB Connected');
}).catch((err) => {
  console.log(err);
});

app.use(express.json());

app.use(cors());
app.options('*', cors());
app.use(helmet());
app.use(requestLogger);

app.post('/signup', createUser);
app.post('/signin', login);
app.post('/articles', createArticle);

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
