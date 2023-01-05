'use strict';
const { Model, Sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class ExamGroupMapping extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			ExamGroupMapping.belongsTo(models.Group, {
				foreignKey: 'group_id',
				targetKey: 'id',
				as: 'groups',
			});

			ExamGroupMapping.belongsTo(models.Exam, {
				foreignKey: 'exam_id',
				targetKey: 'id',
				as: 'exams',
			});
		}
	}
	ExamGroupMapping.init(
		{
			exam_id: {
				allowNull: false,
				type: Sequelize.UUID,
				references: {
					model: 'exam',
					key: 'id',
				},
			},
			group_id: {
				allowNull: false,
				type: Sequelize.UUID,
				references: {
					model: 'group',
					key: 'id',
				},
			},
    },
		{
			sequelize,
			modelName: 'ExamGroupMapping',
			tableName: 'exam_group_mapping',
			paranoid: true,
		}
	);
	return ExamGroupMapping;
};
