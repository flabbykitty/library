const express = require('express');
const router = express.Router();

const {createRules, updateRules} = require('../validation/user_validation')
const {destroy, index, show, store, update} = require('../controllers/user_controller')

/* GET / */
router.get('/', index);

/* GET /:userId */
router.get('/:userId', show);

/* POST / */
router.post('/', createRules, store);

/* PUT /:userId */
router.put('/:userId', updateRules, update);

/* DELETE /:authorId */
router.delete('/:userId', destroy);


module.exports = router;
