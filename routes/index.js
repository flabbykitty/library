const express = require('express');
const router = express.Router();

const auth = require('../controllers/middlewares/auth')

const authController = require('../controllers/auth_controller')

const userValidationRules = require('../validation/user_validation')

/* GET / */
router.get('/', (req, res) => {
	res.send({ status: 'you had me at EHLO' });
});

// Protect all routes below with middleware 'basic' from the auth module

router.use('/authors', require('./authors_routes'));
router.use('/books', require('./books_routes'));

// add ability to login and JWT access-token and refresh-token
router.post('/login', authController.login)

// add ability to refresh a token
router.post('/refresh', authController.refresh)

// add ability to register a user
router.post('/register', [userValidationRules.createRules], authController.register)

// add ability to validate JWTs
router.use('/profile', [auth.validateJwtToken], require('./profile_routes'));

// router.use('/users', require('./users_routes'));

module.exports = router;
