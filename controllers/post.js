const User = require('../models/user');

exports.afterUploadImage = (req, res) => {
   console.log(req.file);
   res.json({ url: `/img/${req.file.filename}` });
};
exports.likePost = async (req, res, next) => {
   try {
      const user = await User.findOne({ where: { id: req.user.id } });
      if (user) {
         //insert into Like(Userid, Postid) values 1,1;
         await user.addLiked(parseInt(req.params.id, 10));
         res.send('success');
      }
   } catch (error) {
      console.log(error);
      next(error);
   }
};

exports.unlikePost = async (req, res, next) => {
   try {
      const user = await User.findOne({ where: { id: req.user.id } });
      if (user) {
         //insert into Like(Userid, Postid) values 1,1;
         await user.removeLiked(parseInt(req.params.id, 10));
         res.send('success');
      }
   } catch (error) {
      console.log(error);
      next(error);
   }
};
