const News = require('../models/News');

exports.getAllNews = async (req, res, next) => {
  try {
    const news = await News.find({ isPublished: true }).sort({ publishedDate: -1 });
    res.json({ success: true, data: news });
  } catch (err) {
    next(err);
  }
};

exports.getNewsById = async (req, res, next) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ success: false, message: 'News article not found' });
    }
    res.json({ success: true, data: news });
  } catch (err) {
    next(err);
  }
};
