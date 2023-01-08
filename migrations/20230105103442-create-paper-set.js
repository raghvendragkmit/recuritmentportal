'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('paper_set', {
			id: {
				allowNull: false,
				primaryKey: true,
				type: Sequelize.UUID,
				defaultValue: Sequelize.literal('uuid_generate_v4()'),
			},

			subject_id: {
				allowNull: false,
				type: Sequelize.UUID,
				references: {
					model: 'subject',
					key: 'id',
				},
			},

			paper_set_name: {
				allowNull: false,
				type: Sequelize.STRING,
			},
			marks_per_question: {
				allowNull: false,
				type: Sequelize.FLOAT,
			},
			negative_marks_per_question: {
				allowNull: false,
				type: Sequelize.FLOAT,
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
			total_questions: {
				allowNull: false,
				type: Sequelize.INTEGER,
				defaultValue: 0,
			},
		});
	},
	// eslint-disable-next-line no-unused-vars
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('paper_set');
	},
};
