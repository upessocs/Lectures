const express = require('express');
const router = express.Router();
const upload = require('../config/multerConfig');
const handleUpload = require('../controllers/uploadController');

router.post('/', upload.single('myfile'), handleUpload);

module.exports = router;
