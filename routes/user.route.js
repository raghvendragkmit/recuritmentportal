const express = require('express');
const router = express.Router();
const models = require('../models');

router.get('/data', async (req, res) => {
	const userGroupdata = await models.GroupUserMapping.findAll({
		where: { group_id: 'a34af8eb-ed68-49e7-8411-07ee49f1d25c' },
		include: [
			{
				model: models.User,
				as: 'users',
			},
		],
	});

	return res.status(200).json(userGroupdata);
});

module.exports = router;
