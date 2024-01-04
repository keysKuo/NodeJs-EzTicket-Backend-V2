const { POST_CreateCategory, DELETE_RemoveCategory } = require('./Resoilver');

const router = require('express').Router();


router.post('/create', POST_CreateCategory);

router.delete('/delete/:category_id', DELETE_RemoveCategory);

module.exports = router;