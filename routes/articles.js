const router = require('express').Router();
const { Joi, celebrate } = require('celebrate');
const { deleteArticle, getArticles } = require('../controllers/articles');

router.get('/articles', getArticles);

router.delete('/articles/:articleId', celebrate({
  params: Joi.object().keys({
    articleId: Joi.string(),
  }),
}), deleteArticle);

module.exports = router;
