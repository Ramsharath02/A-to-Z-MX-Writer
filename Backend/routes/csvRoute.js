const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const { uploadCsv } = require('../controllers/csvController');
const validateBody = require('../middlewares/validateBody');

router.post(
  '/upload-csv',
  validateBody(['name', 'email', 'csvName']),
  upload.single('file'),
  uploadCsv
);

module.exports = router;
