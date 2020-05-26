const models = require('../models');
const {body, matchedData, validationResult} = require('express-validator')
const bcrypt = require('bcrypt');


const index = async (req, res) => {

	const all_users = await models.User.fetchAll();

	res.send({
		status: 'success',
		data: {
			users: all_users
		}
	});
}

const show = async (req, res) => {
	const user = await new models.User({id: req.params.userId}).fetch({ withRelated: 'books' })

	models.User.login(user.get('username'), user.get('password'))

	res.send({
		status: 'success',
		data: {
			user,
		}
	});

}



const store = async (req, res) => {
	const errors = validationResult(req)
	if(!errors.isEmpty()) {
        res.status(422).send({
            status: 'fail',
            data: errors.array()
		})
		return;
	}
    
	const validData = matchedData(req)

	// Generate a hash of 'validData.password'
	try {
		validData.password = await bcrypt.hash(validData.password, models.User.hashSaltRounds);
	}
	catch(error) {
		res.status(500).send({
			status: 'error',
			message: 'Exception thrown when trying to hash'
		})
		throw error
	}


	try{
		const user = await models.User.forge(validData).save();
		res.send({
			status: 'success',
			data: {
				user,
			}
		});
	}
	catch(error) {
		res.status(500).send({
			status: 'error',
			message: 'Exception thrown in database when creating a new user'
		})
		throw error
	}
}


/**
 * Update a specific user
 */
const update = async (req, res) => {
	const userId = req.params.userId
	const user = await new models.User({id:userId}).fetch({require: false})

	if(!user) {
		res.status(404).send({
			status: 'fail',
			data: 'User not found'
		})
		return
	}

	const errors = validationResult(req)
	if(!errors.isEmpty()) {
        res.status(422).send({
            status: 'fail',
            data: errors.array()
		})
		return;
	}

	const validData = matchedData(req)

	try {
		const updatedUser = await user.save(validData)
		res.send({
			status: 'success',
			data: {
				user: updatedUser
			}
		})
	} catch(error) {
		res.status(500).send({
			status: 'error',
			message: 'Exception thrown in database when updating user'
		})
	}
}

/**
 * Delete a specific user
 */
const destroy = async (req, res) => {
	res.status(405).send({
		error: "No site for you. Yet."
	})
}

module.exports = {
	destroy,
    index,
	show,
	store,
	update
}