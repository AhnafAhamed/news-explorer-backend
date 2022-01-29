const router = require('express');
const { createUser } = require('../controllers/users');

router.post('/signup', createUser);

module.exports = router;
