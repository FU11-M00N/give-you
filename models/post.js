const Sequelize = require('sequelize');

class Post extends Sequelize.Model {
   static initiate(sequelize) {
      Post.init(
         {
            title: {
               type: Sequelize.STRING(50),
               allowNull: false,
            },
            content: {
               type: Sequelize.STRING(150),
               allowNull: false,
            },
            img: {
               type: Sequelize.STRING(200),
               allowNull: true,
            },
            hit: {
               type: Sequelize.INTEGER,
               allowNull: false,
               defaultValue: 0,
            },
         },
         {
            sequelize,
            timestamps: true,
            underscored: false,
            paranoid: false,
            modelName: 'Post',
            tableName: 'posts',
            charset: 'utf8',
            collate: 'utf8_general_ci',
         },
      );
   }
   static associate(db) {
      db.Post.belongsTo(db.User);
      db.Post.belongsToMany(db.User, {
         through: 'PostLike',
         as: 'Liker',
      });
      db.Post.belongsToMany(db.Hashtag, {
         through: 'PostHashtag',
      });
      db.Post.hasOne(db.Comment);
   }
}

module.exports = Post;
