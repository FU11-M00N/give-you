const Sequelize = require('sequelize');

class Comment extends Sequelize.Model {
   static initiate(sequelize) {
      Comment.init(
         {
            content: {
               type: Sequelize.STRING(150),
               allowNull: false,
            },
            class: {
               type: Sequelize.INTEGER,
               defaultValue: 0,
            },
            order: {
               type: Sequelize.INTEGER,
               defaultValue: 0,
            },
         },
         {
            sequelize,
            timestamps: true,
            underscored: false,
            paranoid: false,
            modelName: 'Comment',
            tableName: 'comments',
         },
      );
   }
   static associate(db) {
      db.Comment.belongsTo(db.Post);
      db.Comment.belongsTo(db.User); // 1:N 유저, 댓글
   }
}
module.exports = Comment;
