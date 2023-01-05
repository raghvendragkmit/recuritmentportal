'use strict';
const { Model, Sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Group extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			Group.belongsToMany(models.User, {
				through: models.GroupUserMapping,
				foreignKey: 'group_id',
				sourceKey: 'id',
			});

			Group.belongsToMany(models.Exam, {
				through: models.ExamGroupMapping,
				foreignKey: 'group_id',
				sourceKey: 'id',
			});
		}
	}
	Group.init(
		{
			group_name: {
				type: Sequelize.STRING,
				allowNull: false,
			},
		},
		{
			sequelize,
			modelName: 'Group',
			tableName: 'group',
			paranoid: true,
		}
	);
	return Group;
};
