const router = require('express').Router();
const { Joi, celebrate } = require('celebrate');
const { deleteArticle, getArticles, createArticle } = require('../controllers/articles');
const validateUrl = require('../utils/validateUrl');

router.get('/articles', getArticles);

router.delete('/articles/:articleId', celebrate({
  params: Joi.object().keys({
    articleId: Joi.string().hex(),
  }),
}), deleteArticle);

router.post('/articles', celebrate({
  body: Joi.object().keys({
    keyword: Joi.string(),
    title: Joi.string(),
    text: Joi.string(),
    date: Joi.string(),
    source: Joi.string(),
    link: Joi.string().custom(validateUrl),
    image: Joi.string().custom(validateUrl),
  }),
}), createArticle);

module.exports = router;
