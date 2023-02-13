const express = require('express');
const router = express.Router();
const { hashtagSearch, postSearch } = require('../controllers/search');

// http://giveyou/search/post
router.get('/tagged', hashtagSearch);
router.post('/post', postSearch);

module.exports = router;
