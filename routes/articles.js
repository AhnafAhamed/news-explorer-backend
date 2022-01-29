const router = require('express').Router();
const { deleteArticle } = require('../controllers/articles');

router.delete('/articles/:articleId', deleteArticle);

module.exports = router;
