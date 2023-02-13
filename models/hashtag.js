const Sequelize = require('sequelize');

class Hashtag extends Sequelize.Model {
   static initiate(sequelize) {
      Hashtag.init(
         {
            title: {
               type: Sequelize.STRING(20),
               allowNULL: false,
               unique: true,
            },
         },
         {
            sequelize,
            timestamps: true,
            underscored: false,
            paranoid: false,
            modelName: 'Hashtag',
            tableName: 'hashtags',
         },
      );
   }
   static associate(db) {
      db.Hashtag.belongsToMany(db.Post, {
         through: 'PostHashtag',
      });
   }
}
module.exports = Hashtag;
