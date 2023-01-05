'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, Sequelize) => {
	class User extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			User.belongsToMany(models.Group, {
				through: models.GroupUserMapping,
				foreignKey: 'user_id',
				sourceKey: 'id',
			});
		}
	}
	User.init(
		{
			first_name: {
				type: Sequelize.STRING,
				allowNull: false,
				validate: {
					isAlpha: true,
				},
			},
			last_name: {
				type: Sequelize.STRING,
				allowNull: false,
				validate: {
					isAlpha: true,
				},
			},
			email: {
				type: Sequelize.STRING,
				allowNull: false,
				unique: true,
				validate: {
					isEmail: true,
				},
			},
			password: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			organization: {
				type: Sequelize.STRING,
				allowNull: false,
				validate: {
					isAlpha: true,
				},
			},
			contact_number: {
				type: Sequelize.STRING,
				allowNull: false,
				validate: {
					isNumeric: true,
				},
			},
			role: {
				type: Sequelize.STRING,
				allowNull: false,
			},
		},
		{
			sequelize,
			modelName: 'User',
			tableName: 'user',
			paranoid: true,
		}
	);
	return User;
};
