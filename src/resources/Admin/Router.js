const { POST_SearchBooking, GET_RefundList, POST_AdminLogin, ANY_CheckAdminToken } = require('./Resolver');
const router = require('express').Router();


router.post('/search_booking', POST_SearchBooking);

router.get('/refund_list', GET_RefundList);

router.post('/login', POST_AdminLogin);

router.get('/test_authentication', ANY_CheckAdminToken);

module.exports = router;