const express = require('express');
const router = express.Router();

const {destroy, index, show, store, update} = require('../controllers/author_controller')

/* GET / */
router.get('/', index);

/* GET /:authorId */
router.get('/:authorId', show);

/* POST / */
router.post('/', store);

/* PUT /:authorId */
router.put('/:authorId', update);

/* DELETE /:authorId */
router.delete('/:authorId', destroy);

module.exports = router;
