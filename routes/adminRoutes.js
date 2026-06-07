const express = require('express');
const { body } = require('express-validator');
const admin = require('../controllers/adminController');

const router = express.Router();

// Associates
router.get('/associates', admin.getAll('Associate'));
router.get('/associates/:id', admin.getById('Associate'));
router.post('/associates', [
  body('name').trim().notEmpty(),
  body('email').isEmail(),
], admin.create('Associate'));
router.put('/associates/:id', admin.update('Associate'));
router.delete('/associates/:id', admin.remove('Associate'));

// Staff
router.get('/staff', admin.getAll('Staff'));
router.get('/staff/:id', admin.getById('Staff'));
router.post('/staff', [
  body('fullName').trim().notEmpty(),
  body('email').isEmail(),
], admin.create('Staff'));
router.put('/staff/:id', admin.update('Staff'));
router.delete('/staff/:id', admin.remove('Staff'));

// Departments
router.get('/departments', admin.getAll('Department'));
router.get('/departments/:id', admin.getById('Department'));
router.post('/departments', [
  body('name').trim().notEmpty(),
], admin.create('Department'));
router.put('/departments/:id', admin.update('Department'));
router.delete('/departments/:id', admin.remove('Department'));

// Clients
router.get('/clients', admin.getAll('Client'));
router.get('/clients/:id', admin.getById('Client'));
router.post('/clients', [
  body('companyName').trim().notEmpty(),
  body('contactPerson').trim().notEmpty(),
  body('email').isEmail(),
], admin.create('Client'));
router.put('/clients/:id', admin.update('Client'));
router.delete('/clients/:id', admin.remove('Client'));

// Projects
router.get('/projects', admin.getAll('Project'));
router.get('/projects/:id', admin.getById('Project'));
router.post('/projects', [
  body('name').trim().notEmpty(),
  body('client').notEmpty(),
], admin.create('Project'));
router.put('/projects/:id', admin.update('Project'));
router.delete('/projects/:id', admin.remove('Project'));

// Tasks
router.get('/tasks', admin.getAll('Task'));
router.get('/tasks/:id', admin.getById('Task'));
router.post('/tasks', [
  body('title').trim().notEmpty(),
], admin.create('Task'));
router.put('/tasks/:id', admin.update('Task'));
router.delete('/tasks/:id', admin.remove('Task'));

// Finance
router.get('/finance', admin.getAll('Finance'));
router.get('/finance/:id', admin.getById('Finance'));
router.post('/finance', [
  body('type').isIn(['income','expense','invoice']),
  body('category').trim().notEmpty(),
  body('amount').isNumeric(),
], admin.create('Finance'));
router.put('/finance/:id', admin.update('Finance'));
router.delete('/finance/:id', admin.remove('Finance'));

// Documents
router.get('/documents', admin.getAll('Document'));
router.get('/documents/:id', admin.getById('Document'));
router.post('/documents', [
  body('name').trim().notEmpty(),
  body('fileUrl').notEmpty(),
], admin.create('Document'));
router.put('/documents/:id', admin.update('Document'));
router.delete('/documents/:id', admin.remove('Document'));

// Notices
router.get('/notices', admin.getAll('Notice'));
router.get('/notices/:id', admin.getById('Notice'));
router.post('/notices', [
  body('title').trim().notEmpty(),
  body('content').trim().notEmpty(),
], admin.create('Notice'));
router.put('/notices/:id', admin.update('Notice'));
router.delete('/notices/:id', admin.remove('Notice'));

// Events
router.get('/events', admin.getAll('Event'));
router.get('/events/:id', admin.getById('Event'));
router.post('/events', [
  body('title').trim().notEmpty(),
  body('startDate').notEmpty(),
], admin.create('Event'));
router.put('/events/:id', admin.update('Event'));
router.delete('/events/:id', admin.remove('Event'));

// Messages
router.get('/messages', admin.getAll('Message'));
router.get('/messages/:id', admin.getById('Message'));
router.post('/messages', [
  body('sender').notEmpty(),
  body('body').trim().notEmpty(),
], admin.create('Message'));
router.put('/messages/:id', admin.update('Message'));
router.delete('/messages/:id', admin.remove('Message'));

// Leads
router.get('/leads', admin.getAll('Lead'));
router.get('/leads/:id', admin.getById('Lead'));
router.post('/leads', [
  body('name').trim().notEmpty(),
  body('email').isEmail(),
], admin.create('Lead'));
router.put('/leads/:id', admin.update('Lead'));
router.delete('/leads/:id', admin.remove('Lead'));

// Tickets
router.get('/tickets', admin.getAll('Ticket'));
router.get('/tickets/:id', admin.getById('Ticket'));
router.post('/tickets', [
  body('subject').trim().notEmpty(),
  body('description').trim().notEmpty(),
], admin.create('Ticket'));
router.put('/tickets/:id', admin.update('Ticket'));
router.delete('/tickets/:id', admin.remove('Ticket'));

// Settings
router.get('/settings', async (req, res) => {
  const Setting = require('../models/Setting');
  let settings = await Setting.findOne();
  if (!settings) settings = await Setting.create({ companyName: 'N.A.R.S. Associates' });
  res.json({ success: true, data: settings });
});
router.put('/settings', async (req, res) => {
  const Setting = require('../models/Setting');
  const settings = await Setting.findOneAndUpdate({}, req.body, { upsert: true, new: true });
  res.json({ success: true, data: settings });
});

// Dashboard stats
router.get('/stats', admin.getDashboardStats);

module.exports = router;
