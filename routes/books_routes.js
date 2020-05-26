const express = require('express');
const router = express.Router();

const {destroy, index, show, store, update} = require('../controllers/book_controller')

/* GET / */
router.get('/', index);

/* GET /:bookId */
router.get('/:bookId', show);

/* POST / */
router.post('/', store);

/* PUT /:bookId */
router.put('/:bookId', update);

/* DELETE /:bookId */
router.delete('/:bookId', destroy);

module.exports = router;
