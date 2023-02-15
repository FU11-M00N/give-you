const Post = require('../models/post');
const User = require('../models/user');
const Hashtag = require('../models/hashtag');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { post } = require('../routes/search');

exports.postSearch = async (req, res, next) => {
   try {
      // select * from posts where title like "&호&";
      if ('title' === req.body.type) {
         const posts = await Post.findAll({ where: { title: { [Op.like]: `%${req.body.title}%` } } });
         console.log(posts);
      } else if ('writer' === req.body.type) {
         // select * from posts p join user u on p.UserId = u.id where u.nick like "req.body.writer"
         const posts = await Post.findAll({
            include: [
               {
                  model: User,
                  where: { nick: { [Op.like]: `%${req.body.writer}%` } },
               },
            ],
            order: [['createdAt', 'DESC']],
         });
         console.log(posts);
      }
      res.send('success');
   } catch (error) {
      next(error);
   }
};
exports.hashtagSearch = async (req, res, next) => {
   // select p.content, p.id from posts p join PostHashtag ph on p.id = ph.postId join hashtags h on ph.hashtagId=h.id
   // where h.title="강아지";
   // 1. 유저에게서 검색 키워드 가져옴
   // 2. 가져온 키워드로 해시태그를 찾아온다. ( 객체 타입 )
   // 3. 해당 해시태그를 가진 Post 들을 가져온다.
   try {
      const query = req.query.hashtag; // 강아지
      const hashtag = await Hashtag.findOne({ where: { title: query } });
      let posts = [];
      if (hashtag) {
         // SELECT `Post`.`id`, `Post`.`content`, `Post`.`img`, `Post`.`createdAt`, `Post`.`updatedAt`, `Post`.`UserId`, `User`.`id` AS `User.id`, `User`.`nick` AS `User.nick`, `PostHashtag`.`createdAt` AS `PostHashtag.createdAt`, `PostHashtag`.`updatedAt` AS `PostHashtag.updatedAt`, `PostHashtag`.`HashtagId` AS `PostHashtag.HashtagId`, `PostHashtag`.`PostId` AS `PostHashtag.PostId`
         // FROM `posts` AS `Post` LEFT OUTER JOIN `user` AS `User` ON `Post`.`UserId` = `User`.`id` AND (`User`.`deletedAt` IS NULL) INNER JOIN `PostHashtag` AS `PostHashtag` ON `Post`.`id` = `PostHashtag`.`PostId` AND `PostHashtag`.`HashtagId` = 1 ORDER BY `Post`.`createdAt` DESC;
         // https://sequelize.org/docs/v6/core-concepts/assocs/#foohasmanybar
         posts = await hashtag.getPosts({
            include: [{ model: User, attributes: ['id', 'nick'] }],
            order: [['createdAt', 'DESC']],
         });
         console.log('posts', posts[0]); // 리턴 필요
      }
      res.json(posts);
      res.send('success');
   } catch (error) {
      console.error(error);
      next(error);
   }
};
