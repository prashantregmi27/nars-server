exports.getServices = async (req, res, next) => {
  try {
    const services = [
      { id: 1, name: 'Engineering Consultancy', description: 'Civil, structural, mechanical, and electrical engineering solutions.' },
      { id: 2, name: 'Project Management', description: 'End-to-end project planning, execution, and monitoring.' },
      { id: 3, name: 'Architectural Design', description: 'Innovative and sustainable architectural designs.' },
      { id: 4, name: 'Environmental Assessment', description: 'Environmental impact analysis and mitigation planning.' },
      { id: 5, name: 'Survey & Geomatics', description: 'Land surveying, GIS mapping, and geospatial analysis.' },
    ];
    res.json({ success: true, data: services });
  } catch (err) {
    next(err);
  }
};
