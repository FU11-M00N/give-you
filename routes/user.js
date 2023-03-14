const express = require('express');
const router = express.Router();
const passport = require('passport');
const { isLoggedIn, isNotLoggedIn } = require('../middlewares');
const { resetPwd } = require('../controllers/user');

router.patch('/password', resetPwd);

module.exports = router;
