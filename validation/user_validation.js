const {body} = require('express-validator')

const createRules = [
    body('username').trim().isLength({min:2}),
    body('password').trim().isLength({min:4}),
    body('first_name').trim().not().isNumeric(),
    body('last_name').trim().not().isNumeric(),
]

const updateRules = [
    body('username').optional().trim().isLength({min:2}),
    body('password').optional().trim().isLength({min:4}),
    body('first_name').optional().trim().not().isNumeric(),
    body('last_name').optional().trim().not().isNumeric(),
]

module.exports = {
    createRules,
    updateRules
}