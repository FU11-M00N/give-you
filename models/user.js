const Sequelize = require('sequelize');

class User extends Sequelize.Model {
   static initiate(sequelize) {
      User.init(
         {
            email: {
               type: Sequelize.STRING(40),
               allowNull: true,
               unique: true,
            },
            nick: {
               type: Sequelize.STRING(15),
               allowNull: false,
            },
            password: {
               type: Sequelize.STRING(100),
               allowNull: true,
            },
            provider: {
               type: Sequelize.ENUM('local', 'kakao', 'google'),
               allowNull: false,
               defaultValue: 'local',
            },
            snsId: {
               type: Sequelize.STRING(30),
               allowNull: true,
            },
         },
         {
            sequelize,
            timestamps: true, // createdAt, updatedAt
            underscored: false, // create_At, update_At
            modelName: 'User', // js에서 쓰는 이름
            tableName: 'user', // db 이름
            paranoid: true, // deleteAt 추가 (유저 삭제일) // soft delete
            charset: 'utf8',
            collate: 'utf8_general_ci',
         },
      );
   }
}
module.exports = User;
