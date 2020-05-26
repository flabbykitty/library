const models = require('../models');



const index = async (req, res) => {
	const all_books = await models.Book.fetchAll();

	res.send({
		status: 'success',
		data: {
			books: all_books
		}
	});
}

const show = async (req, res) => {
	const book = await new models.Book({id: req.params.bookId}).fetch({ withRelated: 'author' })

	res.send({
		status: 'success',
		data: {
			book,
		}
	});
}

const store = async (req, res) => {
	res.status(405).send({
		error: "No site for you. Yet."
	})
}

const update = async (req, res) => {
	res.status(405).send({
		error: "No site for you. Yet."
	})
}

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