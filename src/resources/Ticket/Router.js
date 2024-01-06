const { POST_CreateTicket, PUT_UpdateTicket, DELETE_RemoveTicket, GET_TicketDetail, GET_SearchTickets } = require('./Resolver');

const router = require('express').Router();

router.post('/create', POST_CreateTicket);

router.put('/update/:ticket_id', PUT_UpdateTicket);

router.delete('/delete/:ticket_id', DELETE_RemoveTicket);

router.get('/detail/:ticket_code', GET_TicketDetail);

router.get('/search', GET_SearchTickets);

module.exports = router;