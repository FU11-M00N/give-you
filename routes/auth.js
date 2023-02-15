const express = require('express');
const router = express.Router();
const passport = require('passport');
const { isLoggedIn, isNotLoggedIn, corsWhenDomainMatcher } = require('../middlewares');
const { join, login } = require('../controllers/auth');

router.use(corsWhenDomainMatcher);

router.post('/join', isNotLoggedIn, join);
router.post('/login', isNotLoggedIn, login);
router.get('/kakao', passport.authenticate('kakao'));

// /auth/kaka -> 카카오톡 로그인 화면 -> /auth/kakao/callback
// /auth/kakao/callback
router.get(
   '/kakao/callback',
   passport.authenticate('kakao', {
      failureRedirect: '/?loginError=카카오로그인 실패',
   }),
   (req, res) => {
      res.redirect('/');
   },
);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get(
   '/google/callback',
   passport.authenticate('google', {
      failureRedirect: '/?loginError=구글로그인 실패',
   }),
   (req, res) => {
      res.redirect('/');
   },
);

module.exports = router;
