const Contact = require('../models/Contact');
const { sendContactNotification } = require('../utils/mailer');

exports.submitContact = async (req, res, next) => {
  try {
    const { name, email, phone, company, message, type, serviceInterests, ...extra } = req.body;

    const contact = await Contact.create({
      name,
      email,
      phone,
      company,
      message,
      type,
      serviceInterests,
      metadata: Object.keys(extra).length > 0 ? extra : undefined,
    });

    sendContactNotification(contact.toObject());

    res.status(201).json({
      success: true,
      message: 'Your message has been received. We will get back to you shortly.',
      data: contact,
    });
  } catch (err) {
    next(err);
  }
};

exports.getContacts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const type = req.query.type;

    const filter = type ? { type } : {};
    const total = await Contact.countDocuments(filter);
    const contacts = await Contact.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    res.json({
      success: true,
      data: contacts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    next(err);
  }
};
