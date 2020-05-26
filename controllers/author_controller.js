const models = require('../models');


const index = async (req, res) => {
	const all_authors = await models.Author.fetchAll();

	res.send({
		status: 'success',
		data: {
			authors: all_authors
		}
	});
}

const show = async (req, res) => {
	const author = await new models.Author({id: req.params.authorId}).fetch({ withRelated: 'books' })

	res.send({
		status: 'success',
		data: {
			author,
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