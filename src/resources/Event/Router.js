const router = require('express').Router();
const { POST_CreateEvent, PUT_UpdateEvent, DELETE_RemoveEvent, GET_EventDetail, GET_SearchEvents } = require('./Resolver');
const { upload } = require('../../middlewares/multer');
const { Validate_CreateEvent } = require('./Validator');

router.post('/create', upload.single('file'), Validate_CreateEvent, POST_CreateEvent);

router.put('/update/:event_id', upload.single('file'), PUT_UpdateEvent);

router.delete('/delete/:event_id', DELETE_RemoveEvent);

router.get('/detail/:event_id', GET_EventDetail);

router.get('/search', GET_SearchEvents);

module.exports = router;
