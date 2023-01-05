'use strict';
const { Model, Sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Exam extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			Exam.belongsTo(models.Subject, {
				foreignKey: 'subject_id',
				targetKey: 'id',
				as: 'subjects',
			});

			Exam.belongsToMany(models.Group, {
				through: models.ExamGroupMapping,
				foreignKey: 'exam_id',
				sourceKey: 'id',
			});
		}
	}
	Exam.init(
		{
			subject_id: {
				allowNull: false,
				type: Sequelize.UUID,
				references: {
					model: 'subject',
					key: 'id',
				},
			},
			exam_start_time: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			exam_end_time: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			exam_passing_percentage: {
				allowNull: false,
				type: Sequelize.DECIMAL,
			},
		},
		{
			sequelize,
			modelName: 'Exam',
			tableName: 'exam',
			paranoid: true,
		}
	);
	return Exam;
};
