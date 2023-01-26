const Sequelize = require('sequelize');

class Post extends Sequelize.Model {
   static initiate(sequelize) {
      Post.init(
         {
            content: {
               type: Sequelize.STRING(150),
               allowNull: false,
            },
            img: {
               type: Sequelize.STRING(200),
               allowNull: true,
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
}

module.exports = Post;
