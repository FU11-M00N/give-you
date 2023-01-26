const bcrypt = require('bcrypt');
const passport = require('passport');
const User = require('../models/user');

exports.join = async (req, res, next) => {
   const { email, nick, password, age, gender } = req.body;
   try {
      const exUser = await User.findOne({ where: { email } });
      if (exUser) {
         return res.redirect('/join?error=exist');
      }
      const hash = await bcrypt.hash(password, 12);
      await User.create({
         email,
         nick,
         password: hash,
      });
      return res.redirect('/');
   } catch (error) {
      console.error(error);
   }
};

//* 로그인 요청
// 사용자 미들웨어 isNotLoggedIn 통과해야 async (req, res, next) => 미들웨어 실행
exports.login = async (req, res, next) => {
   passport.authenticate('local', (authError, user, info) => {
      //? (authError, user, info) => localstrategy에서 done()이 호출되면 실행된다.
      //? localstrategy에 done()함수에 로직 처리에 따라 1,2,3번째 인자에 넣는 순서가 다름.

      // done(err)가 처리 된 경우
      if (authError) {
         console.error(authError);
         return next(authError);
      }
      if (!user) {
         return res.redirect(`/?loginError=${info.message}`);
      }
      // done(null, exUser)가 처리 된 경우(로그인 성공) passport/index.js로 가서 실행시킨다.
      return req.login(user, loginError => {
         if (loginError) {
            console.error(loginError);
            return next(loginError);
         }
         return res.redirect('/');
      });
   })(req, res, next);
};
