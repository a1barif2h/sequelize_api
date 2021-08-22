'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({User}) {
      // define association here
      this.belongsTo(User, {foreignKey: 'userId', as: 'user'})
    }

    toJSON(){
      return {...this.get(), id: undefined, userId: undefined}
    }
  };
  Post.init({
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    body: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {msg: 'Post body must have post text.'},
        notEmpty: {msg: 'Post must not be empty.'}
      },
    }
  }, {
    sequelize,
    tableName:'posts',
    modelName: 'Post',
  });
  return Post;
};