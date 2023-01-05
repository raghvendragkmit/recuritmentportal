'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('exam_user_response', {
			id: {
				allowNull: false,
				primaryKey: true,
				type: Sequelize.UUID,
				defaultValue: Sequelize.literal('uuid_generate_v4()'),
			},

			exam_user_attempt_id: {
				allowNull: false,
				type: Sequelize.UUID,
				references: {
					model: 'exam_user_paper_set_mapping',
					key: 'id',
				},
			},

			question_answer_id: {
				allowNull: false,
				type: Sequelize.UUID,
				references: {
					model: 'question_answer',
					key: 'id',
				},
			},

			answer: {
				allowNull: false,
				type: Sequelize.STRING,
			},

			is_correct: {
				allowNull: false,
				type: Sequelize.BOOLEAN,
			},

			created_at: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.NOW,
			},
			updated_at: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.NOW,
			},
			deleted_at: {
				allowNull: true,
				type: Sequelize.DATE,
				defaultValue: null,
			},
		});
	},
	// eslint-disable-next-line no-unused-vars
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('exam_user_response');
	},
};
