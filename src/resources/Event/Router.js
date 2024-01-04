const router = require('express').Router();
const { POST_CreateEvent, PUT_UpdateEvent, DELETE_RemoveEvent } = require('./Resolver');
const { upload } = require('../../middlewares/multer');
const { Validate_CreateEvent } = require('./Validator');

router.post('/create', upload.single('file'), Validate_CreateEvent, POST_CreateEvent);

router.put('/update/:event_id', upload.single('file'), PUT_UpdateEvent);

router.delete('/delete/:event_id', DELETE_RemoveEvent);

module.exports = router;
