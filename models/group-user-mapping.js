'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, Sequelize) => {
	class GroupUserMapping extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			GroupUserMapping.belongsTo(models.Group, {
				foreignKey: 'group_id',
				targetKey: 'id',
				as: 'groups',
			});

			GroupUserMapping.belongsTo(models.User, {
				foreignKey: 'user_id',
				targetKey: 'id',
				as: 'users',
			});
		}
	}
	GroupUserMapping.init(
		{
			group_id: {
				allowNull: false,
				type: Sequelize.UUID,
				references: {
					model: 'group',
					key: 'id',
				},
			},
			user_id: {
				allowNull: false,
				type: Sequelize.UUID,
				references: {
					model: 'user',
					key: 'id',
				},
			},
		},
		{
			sequelize,
			modelName: 'GroupUserMapping',
			tableName: 'group_user_mapping',
			paranoid: true,
		}
	);
	return GroupUserMapping;
};
