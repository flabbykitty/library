const express = require('express');
const cors = require('cors')
const logger = require('morgan');

const app = express();

app.use(logger('dev'));
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(require('./routes'));

// app.use('/authors', require('./routes/authors_routes'));
// app.use('/books', require('./routes/books_routes'));

module.exports = app;
