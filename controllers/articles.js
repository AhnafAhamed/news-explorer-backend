const articles = require('../models/articles');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const ForbiddenError = require('../errors/forbidden-error');

const createArticle = (req, res, next) => {
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;
  const owner = req.user._id;
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
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return next(new BadRequestError('Validation Error'));
      }
      return next(error);
    })
    .catch(next);
};

const getArticles = (req, res, next) => {
  articles.find({ owner: req.user._id })
    .then((articleList) => {
      res.status(200).send(articleList);
    })
    .catch(next);
};

const deleteArticle = (req, res, next) => {
  articles.findById(req.params.articleId)
    .orFail()
    .then((article) => {
      if (!(article.owner.toString() === req.user._id)) {
        throw new ForbiddenError('Action forbidden');
      }
      articles.findByIdAndDelete(req.params.articleId)
        .orFail()
        .then(() => {
          res.send({ message: 'Article deleted successfully' });
        })
        .catch((error) => {
          if (error.name === 'CastError') {
            return next(new BadRequestError('Invalid articleId'));
          }
          if (error.name === 'DocumentNotFoundError') {
            return next(new NotFoundError('Article not found'));
          }
          return next(error);
        });
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        return next(new BadRequestError('Invalid articleId'));
      }
      if (error.name === 'DocumentNotFoundError') {
        return next(new NotFoundError('Article not found'));
      }
      return next(error);
    });
};

module.exports = { createArticle, deleteArticle, getArticles };
