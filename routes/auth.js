const express = require('express');
const router = express.Router();
const passport = require('passport');
const { isLoggedIn, isNotLoggedIn } = require('../middlewares');
const { join, login, certificate, compareAuthCode } = require('../controllers/auth');

router.post('/join', isNotLoggedIn, join);
router.post('/login', isNotLoggedIn, login);
router.get('/kakao', passport.authenticate('kakao'));
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.post('/certified', isNotLoggedIn, certificate); // 인증번호 전송
router.post('/certified/compared', isNotLoggedIn, compareAuthCode); // 인증번호 비교

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
