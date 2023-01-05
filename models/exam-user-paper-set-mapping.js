'use strict';
const { Model, Sequelize } = require('sequelize');
// eslint-disable-next-line no-unused-vars
module.exports = (sequelize, DataTypes) => {
	class ExamUserPaperSetMapping extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			ExamUserPaperSetMapping.belongsTo(models.Exam, {
				foreignKey: 'exam_id',
				targetKey: 'id',
				as: 'exams',
			});
			ExamUserPaperSetMapping.belongsTo(models.PaperSet, {
				foreignKey: 'paper_set_id',
				targetKey: 'id',
				as: 'paper_sets',
			});
			ExamUserPaperSetMapping.belongsTo(models.User, {
				foreignKey: 'user_id',
				targetKey: 'id',
				as: 'users',
			});
			ExamUserPaperSetMapping.hasMany(models.ExamUserResponse, {
				foreignKey: 'exam_user_attempt_id',
				sourceKey: 'id',
				as: 'exam_users',
			});
		}
	}
	ExamUserPaperSetMapping.init(
		{
			exam_id: {
				allowNull: false,
				type: Sequelize.UUID,
				references: {
					model: 'exam',
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

			paper_set_id: {
				allowNull: false,
				type: Sequelize.UUID,
				references: {
					model: 'paper_set',
					key: 'id',
				},
			},

			start_time: {
				allowNull: true,
				type: Sequelize.DATE,
			},
			submit_time: {
				allowNull: true,
				type: Sequelize.DATE,
			},

			total_questions: {
				allowNull: false,
				type: Sequelize.INTEGER,
				defaultValue: 0,
			},

			total_question_attempted: {
				allowNull: false,
				type: Sequelize.INTEGER,
				defaultValue: 0,
			},

			total_correct_answers: {
				allowNull: false,
				type: Sequelize.INTEGER,
				defaultValue: 0,
			},

			total_marks_obtained: {
				allowNull: false,
				type: Sequelize.FLOAT,
				defaultValue: 0,
			},

			result: {
				allowNull: true,
				type: Sequelize.BOOLEAN,
			},
			publish_result: {
				allowNull: true,
				type: Sequelize.BOOLEAN,
			},
		},
		{
			sequelize,
			modelName: 'ExamUserPaperSetMapping',
			tableName: 'exam_user_paper_set_mapping',
			paranoid: true,
		}
	);
	return ExamUserPaperSetMapping;
};
