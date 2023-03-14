const bcrypt = require('bcrypt');
const User = require('../models/user');
const nodemailer = require('nodemailer');

exports.findId = async (req, res, next) => {
   try {
      const { email } = req.body;
      const user = await User.findOne({ where: { email } });
   } catch (error) {
      console.error(error);
      next();
   }
};

exports.resetPwd = async email => {
   try {
      const user = await User.findOne({ where: { email } });

      console.log('request test', user);
      const RS_PWD = await SendResetEmail(user.email);
      const hash = await bcrypt.hash(RS_PWD, 12);
      console.log('테스트 ', hash);
      await User.update(
         {
            password: hash,
         },
         {
            where: { id: user.id },
         },
      );
   } catch (error) {
      console.error(error);
   }
};

async function SendResetEmail(email) {
   try {
      const transporter = nodemailer.createTransport({
         service: 'gmail', // 이메일
         auth: {
            user: process.env.MAILS_EMAIL, // 발송자 이메일
            pass: process.env.MAILS_PWD, // 발송자 비밀번호
         },
      });

      const RS_PWD = RandomPassword();

      const mailOptions = {
         from: process.env.MAILS_EMAIL,
         to: email,
         subject: '비밀번호 초기화',
         text: RS_PWD,
      };
      const info = await transporter.sendMail(mailOptions);
      return RS_PWD;
   } catch (error) {
      console.error(error);
   }
}

function RandomPassword() {
   let number = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
   let uppercase = [
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
      'G',
      'H',
      'I',
      'J',
      'K',
      'L',
      'M',
      'N',
      'O',
      'P',
      'Q',
      'R',
      'S',
      'T',
      'U',
      'V',
      'W',
      'X',
      'Y',
      'Z',
   ];
   let lowercase = [
      'a',
      'b',
      'c',
      'd',
      'e',
      'f',
      'g',
      'h',
      'i',
      'j',
      'k',
      'l',
      'm',
      'n',
      'o',
      'p',
      'q',
      'r',
      's',
      't',
      'u',
      'v',
      'w',
      'x',
      'y',
      'z',
   ];
   let spechar = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')'];

   let ranValue = '';

   for (i = 0; i < 2; i++) {
      let numRand = Math.floor(Math.random() * number.length);
      let ucRand = Math.floor(Math.random() * uppercase.length);
      let lcRand = Math.floor(Math.random() * lowercase.length);
      let sepcRand = Math.floor(Math.random() * spechar.length);
      ranValue = ranValue + number[numRand] + uppercase[ucRand] + lowercase[lcRand] + spechar[sepcRand];
   }

   return ranValue;
}
