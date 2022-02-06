const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return /^(http|https):\/\/[^ "]+$/g.test(v);
      },
      message: 'Invalid url',
    },
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return /^(http|https):\/\/[^ "]+$/g.test(v);
      },
      message: 'Invalid url',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});

module.exports = mongoose.model('article', articleSchema);
