/**
 * Profile validation rules
 */

const {body} = require('express-validator')
const {Book} = require('../models')

const addBookRules = [
    body('book_id').custom(value => Book.fetchById(value)),
]

const updateProfileRules = [
    body('username').optional().trim().isLength({min:2}),
    body('password').optional().trim().isLength({min:4}),
    body('first_name').optional().trim().not().isNumeric(),
    body('last_name').optional().trim().not().isNumeric(),
]

module.exports = {
    addBookRules,
    updateProfileRules
}