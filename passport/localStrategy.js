const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const bcrypt = require('bcrypt');
const User = require('../models/user');

module.exports = () => {
   passport.use(
      new LocalStrategy(
         {
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: false,
         },
         async (email, password, done) => {
            //done (서버실패, 성공유저, 로직실패)

            try {
               const exUser = await User.findOne({ where: { email } });
               if (exUser) {
                  const result = await bcrypt.compare(password, exUser.password);
                  if (result) {
                     //로그인 성공
                     done(null, exUser);
                  } else {
                     done(null, false, { message: '비밀번호가 일치하지 않습니다. ' });
                  }
               } else {
                  done(null, false, { message: '가입되지 않은 회원입니다.' });
               }
            } catch (error) {
               console.error(error);
               done(error);
            }
         },
      ),
   );
};
