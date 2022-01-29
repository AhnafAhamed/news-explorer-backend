/* eslint-disable no-console */
const express = require('express');
const mongoose = require('mongoose');
const { createArticle } = require('./controllers/articles');
const { createUser } = require('./controllers/users');
const users = require('./routes/users');

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());

app.post('/signup', createUser);
app.post('/articles', createArticle);

app.use('/', users);

mongoose.connect('mongodb://localhost:27017/news-explorer', {
  useNewUrlParser: true,
}).then(() => {
  console.log('DB Connected');
}).catch((err) => {
  console.log(err);
});

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
