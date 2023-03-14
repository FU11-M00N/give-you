const Post = require('../models/post');
const User = require('../models/user');
const Hashtag = require('../models/hashtag');
const Comment = require('../models/comment');
const Sequelize = require('sequelize');
const { sum } = require('../models/post');

// 1. post, comment join
// 2. comment, user join
// 3. comment level

exports.uploadComment = async (req, res, next) => {
   try {
      await Comment.create({
         // class 값 넣을땐 현재 마지막 댓글의 클래스 번호가 몇번인지 체크 후 거기에 +1
         // cosnt a =select class from comment;
         // a = a+1
         content: req.body.content,
         class: (await Comment.max('class')) + 1,
         PostId: req.params.id,
         UserId: req.user.id,
      });
      res.send('success');
   } catch (error) {
      console.error(error);
      next(error);
   }
};
// a 댓글

// class : 댓글 그룹 , order : 그룹 내 순서

// a 댓글 작성
// class 1 order 1
// a 댓글의 대댓글
// class 1 order 2
// b 댓글 작성
// class 2 order 1
// a 댓글의 대댓글의 대댓글
// class 1 order 3
// a 댓글의 새로운 댓글
// class 1 order 2

// select order from comments where Comment id = req.params.id
// update comments set order = order + 1 where

// order === 1{
//  order = order + 1,
//}
exports.uploadCommentReply = async (req, res, next) => {
   try {
      console.log('요청 파라미터 확인', req.params);
      const comment = await Comment.findOne({
         // select order, class from comments where Comment id = req.params.id
         where: { id: req.params.Commentid },
         attributes: ['class', 'order'],
      });

      // 대댓글이 이미 존재 할 때 | class 0 order 1
      // order랑 + 1
      // class 가 뭔지 확인하고, max +1

      // select max(order) from comment where class = comment.class
      const commentOrder = await Comment.findOne({
         group: 'class',
         attributes: [[Sequelize.fn('max', Sequelize.col('order')), 'order_max']],
         having: { class: comment.class },
      });
      let findMaxOrder = commentOrder.dataValues.order_max;
      findMaxOrder = findMaxOrder + 1;
      await Comment.create({
         content: req.body.content,
         class: comment.class,
         order: findMaxOrder,
         PostId: req.params.id,
         UserId: req.user.id,
      });

      res.send('success');
   } catch (error) {
      console.log(error);
      next(error);
   }
};
