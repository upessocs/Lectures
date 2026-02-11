const express = require('express');
const router = express.Router();
const listUploads = require('../controllers/listController');

router.get('/', listUploads);

module.exports = router;
