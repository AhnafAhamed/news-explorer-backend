/* eslint-disable no-console */
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

const getArticles = (req, res, next) => {
  articles.find({})
    .then((articleList) => {
      res.status(200).send(articleList);
    })
    .catch(next);
};

const deleteArticle = (req, res, next) => {
  articles.findByIdAndRemove(req.params.articleId)
    .then((article) => {
      if (!article) {
        console.log('No article found');
      }
      return res.status(200).send({ message: 'Article deleted successfully' });
    })
    .catch(next);
};

module.exports = { createArticle, deleteArticle, getArticles };
