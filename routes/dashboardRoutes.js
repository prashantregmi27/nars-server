const express = require('express');
const { getDashboard, exportContacts, exportApplications } = require('../controllers/dashboardController');

const router = express.Router();

router.get('/', getDashboard);
router.get('/export/contacts', exportContacts);
router.get('/export/applications', exportApplications);

module.exports = router;
