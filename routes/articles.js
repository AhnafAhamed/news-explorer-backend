const router = require('express').Router();
const { deleteArticle, getArticles } = require('../controllers/articles');

router.get('/articles', getArticles);

router.delete('/articles/:articleId', deleteArticle);

module.exports = router;
