const { POST_CreateArea, GET_GetAreaByEventId, DELETE_RemoveArea, PUT_UpdateArea } = require('./Resolver');

const router = require('express').Router();

router.post('/create', POST_CreateArea);

router.get('/event/:event_id', GET_GetAreaByEventId);

router.delete('/delete/:area_id', DELETE_RemoveArea);

router.put('/update/:area_id', PUT_UpdateArea);

module.exports = router;
