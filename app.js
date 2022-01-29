/* eslint-disable no-console */
const express = require('express');
const mongoose = require('mongoose');

const { createUser } = require('./controllers/users');

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());

app.post('/signup', createUser);

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
