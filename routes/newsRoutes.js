const express = require('express');
const { getAllNews, getNewsById } = require('../controllers/newsController');

const router = express.Router();

router.get('/', getAllNews);
router.get('/:id', getNewsById);

module.exports = router;
