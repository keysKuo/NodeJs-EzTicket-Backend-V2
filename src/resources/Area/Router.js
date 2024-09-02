const { POST_CreateArea, GET_GetAreaByEventId, DELETE_RemoveArea } = require('./Resolver');

const router = require('express').Router();

router.post('/create', POST_CreateArea);

router.get('/event/:event_id', GET_GetAreaByEventId);

router.delete('/delete/:area_id', DELETE_RemoveArea);

module.exports = router;
