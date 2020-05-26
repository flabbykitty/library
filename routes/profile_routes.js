const express = require('express');
const router = express.Router();

const {addBookRules, updateProfileRules} = require('../validation/profile_validation')
const {addBook, getProfile, getBooks, updateProfile} = require('../controllers/profile_controller')

/* GET / */
router.get('/', getProfile);

/* GET resourse's books /books */
router.get('/books', getBooks);

/* POST /books */
/* Add a bok to this users collection */
router.post('/books', addBookRules, addBook);

/* PUT / */
router.put('/', updateProfileRules, updateProfile);


module.exports = router;
