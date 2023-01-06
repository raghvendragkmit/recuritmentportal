'use strict';

const { faker } = require('@faker-js/faker');
const bcrypt = require('bcrypt');

const first_name = faker.name.firstName();
const last_name = faker.name.lastName();
const email = faker.internet.email().toLowerCase();
const password = 'Raghav1234';
const organization = faker.company.bs();
const hash = bcrypt.hashSync(password, 10);

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // eslint-disable-next-line no-unused-vars
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('user', [
      {
        first_name: first_name,
        last_name: last_name,
        email: email,
        password: hash,
        role: 'admin',
        organization: organization,
        contact_number: '7987895418',
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },
  // eslint-disable-next-line no-unused-vars
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('user', null, {});
  }
};
