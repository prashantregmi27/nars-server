const express = require('express');
const { getAllPartners, getPartnerById } = require('../controllers/partnerController');

const router = express.Router();

router.get('/', getAllPartners);
router.get('/:id', getPartnerById);

module.exports = router;
