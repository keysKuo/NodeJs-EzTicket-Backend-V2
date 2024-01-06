const User_Router = require('./User/Router');
const Event_Router = require('./Event/Router');
const Category_Router = require('./Category/Router');
const Ticket_Router = require('./Ticket/Router');
const Booking_Router = require('./Booking/Router');
const Business_Router = require('./Business/Router');

const router = require('express').Router();

router.use('/user', User_Router);

router.use('/event', Event_Router);

router.use('/category', Category_Router);

router.use('/ticket', Ticket_Router);

router.use('/booking', Booking_Router);

router.use('/business', Business_Router);

module.exports = router;