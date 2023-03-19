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
                     done(null, false, {
                        password: '아이디 또는 비밀번호를 잘못 입력했습니다. 입력하신 내용을 다시 확인해주세요. ',
                     });
                  }
               } else {
                  done(null, false, {
                     password: '아이디 또는 비밀번호를 잘못 입력했습니다. 입력하신 내용을 다시 확인해주세요.',
                  });
               }
            } catch (error) {
               console.error(error);
               done(error);
            }
         },
      ),
   );
};
