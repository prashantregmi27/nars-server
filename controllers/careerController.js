const Career = require('../models/Career');
const { sendCareerNotification } = require('../utils/mailer');

exports.applyForJob = async (req, res, next) => {
  try {
    const { fullName, email, phone, position, coverLetter, resumeUrl } = req.body;

    const application = await Career.create({
      fullName,
      email,
      phone,
      position,
      coverLetter,
      resumeUrl,
    });

    sendCareerNotification(application.toObject()).catch(() => {});

    res.status(201).json({
      success: true,
      message: 'Your application has been submitted successfully.',
      data: application,
    });
  } catch (err) {
    next(err);
  }
};
