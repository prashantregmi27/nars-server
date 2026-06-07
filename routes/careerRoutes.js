const express = require('express');
const { body } = require('express-validator');
const { applyForJob } = require('../controllers/careerController');
const { validate } = require('../middleware/validate');

const router = express.Router();

router.post(
  '/apply',
  [
    body('fullName').trim().notEmpty().withMessage('Full name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('position').trim().notEmpty().withMessage('Position is required'),
  ],
  validate,
  applyForJob
);

module.exports = router;
