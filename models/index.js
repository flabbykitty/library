// Setting up the database connection
const knex = require('knex')({
    client: 'mysql',
    connection: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER, // AMPPS mysql default: root
        password: process.env.DB_PASSWORD, // AMPPS mysql default password: mysql
        database: process.env.DB_NAME
        }
    })

const bookshelf = require('bookshelf')(knex)

const Author = require('./Author')(bookshelf)
const Book = require('./Book')(bookshelf)
const User = require('./User')(bookshelf)

module.exports = {
    bookshelf,
    Author,
    Book,
    User
}