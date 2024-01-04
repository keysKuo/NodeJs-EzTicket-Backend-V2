const User_Router = require('./User/Router');
const Event_Router = require('./Event/Router');
const Category_Router = require('./Category/Router');

const router = require('express').Router();

router.use('/user', User_Router);

router.use('/event', Event_Router);

router.use('/category', Category_Router);

module.exports = router;