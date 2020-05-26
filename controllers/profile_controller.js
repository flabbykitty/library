const models = require('../models');
const {body, matchedData, validationResult} = require('express-validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


/**
 * Authenticated users profile
 */
const getProfile = async (req, res) => {
	// retrieved authenticated user's profile
	console.log(req.user)
	let user = null;
	try {
		user = await models.User.fetchById(req.user.data.id);
	} catch (err) {
		res.sendStatus(404);
		throw err;
	}

	//send parts of user profile to request
	res.send({
		status: 'success',
		data: {
			username: user.get('username'),
			first_name: user.get('first_name'),
			last_name: user.get('last_name')

		}
	})
}


/**
 * Get the authenticated users books
 */
const getBooks = async (req, res) => {

	// query db for user and load the books relation
	let user = null
	try {
		user = await new models.User({id: req.user.data.id}).fetch({withRelated: 'books'})
	} catch(error) {
		res.status(404)
		return
	}

	const books = user.related('books')

	res.status(405).send({
		status: "success",
		data: {
			books
		},
	})
}


/**
 * Add a book to the authenticated user
 * 
 * POST /books
 * {
 * 		book_id: 4
 * }
 */
const addBook = async (req, res) => {

	const errors = validationResult(req)
	if(!errors.isEmpty()) {
        res.status(422).send({
            status: 'fail',
            data: errors.array()
		})
		return;
	}
	
	try {
		// 1. Make sure the book we want to add actually exists
		const book = await new models.Book({id: req.body.book_id})
		// 2.1 fetch user model
		const user = await new models.User({id: req.user.data.id})
		// 2. create a row in books_users
		// 2.2 on user model, call attach() on the books() relation and pass the Book model
		const result = await user.books().attach(book)
		// 3. return 201 Created, if successful
		res.status(201).send({
			status: 'success',
			data: result
		})
	} catch(error) {
		res.status(500).send({
			status: 'error',
			message: 'error thrown when trying to add book to user'
		})
		throw error
	}
}


/**
 * Update the authenticated users profie
 */
const updateProfile = async (req, res) => {
	let user = null
	try {
		user = await new models.User({id: req.user.data.id})
	} catch(error) {
		res.status(404)
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

	// if request contains password, hash it
	if(validData.password) {
		try {
			validData.password = await bcrypt.hash(validData.password, models.User.hashSaltRounds);
		} catch(error) {
			res.status(500).send({
				status: 'error',
				message: 'Exception thrown in database when hashing password'
			})
			throw error
		}
	}


	try {
		await user.save(validData)

		res.sendStatus(204)
	} catch(error) {
		res.status(500).send({
			status: 'error',
			message: 'Exception thrown in database when updating profile'
		})
		throw error
	}
}

module.exports = {
	addBook,
	getProfile,
	getBooks,
	updateProfile
}