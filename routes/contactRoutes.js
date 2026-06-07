const express = require('express');
const { body } = require('express-validator');
const { submitContact, getContacts } = require('../controllers/contactController');
const { validate } = require('../middleware/validate');

const router = express.Router();

router.post(
  '/',
  [
    body('type')
      .isIn(['rfp', 'consultation', 'general'])
      .withMessage('Type must be rfp, consultation, or general'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('message').trim().notEmpty().withMessage('Message is required'),
  ],
  validate,
  submitContact
);

router.get('/', getContacts);

module.exports = router;
