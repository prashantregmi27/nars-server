const Partner = require('../models/Partner');

exports.getAllPartners = async (req, res, next) => {
  try {
    const partners = await Partner.find().sort({ order: 1, name: 1 });
    res.json({ success: true, data: partners });
  } catch (err) {
    next(err);
  }
};

exports.getPartnerById = async (req, res, next) => {
  try {
    const partner = await Partner.findById(req.params.id);
    if (!partner) {
      return res.status(404).json({ success: false, message: 'Partner not found' });
    }
    res.json({ success: true, data: partner });
  } catch (err) {
    next(err);
  }
};
