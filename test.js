const models = require('./models');
const { sequelize } = require('./models');
async function getData() {
	// const data = await models.User.create({
	// 	first_name: 'raghvendra',
	// 	last_name: 'Khatri',
	// 	email: 'ragha@gmail.com',
	// 	password: 'raghav',
	// 	role: 'user',
	// 	organization: 'ttuhasvhaj',
	// 	contact_number: '8998766786',
	// });

	// console.log(data);

	// const user = await models.User.findAll();
	// console.log(user);

	// const data = await models.Group.create({
	// 	group_name: 'class 7',
	// });

	// const mapping = await models.GroupUserMapping.create({
	// 	user_id: '45d67563-3705-449e-b42b-d7afda43c704',
	// 	group_id: 'a34af8eb-ed68-49e7-8411-07ee49f1d25c',
	// });

	const allGroupUser = await models.GroupUserMapping.findAll();
	console.log(allGroupUser);

	// console.log(mapping);
	

	console.log(userGroupdata);
}

getData();
