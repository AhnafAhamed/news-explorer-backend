const articles = require('../models/articles');

const createArticle = (req, res, next) => {
  const {
    keyword, title, text, date, source, link, image, owner,
  } = req.body;
  articles
    .create({
      keyword,
      title,
      text,
      date,
      source,
      link,
      image,
      owner,
    })
    .then((article) => res.status(200).send(article))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        console.log('validation Error');
      }
      console.log('Error');
    });
};

module.exports = { createArticle };
