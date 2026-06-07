const mongoose = require('mongoose');

exports.getAll = (modelName) => async (req, res, next) => {
  try {
    const Model = mongoose.model(modelName);
    const { page = 1, limit = 20, sort = '-createdAt', ...filters } = req.query;
    delete filters.page; delete filters.limit; delete filters.sort;

    let query = {};
    if (req.query.q) {
      query.$or = Object.keys(Model.schema.paths)
        .filter(p => ['String', 'Number'].includes(Model.schema.paths[p].instance))
        .map(p => ({ [p]: { $regex: req.query.q, $options: 'i' } }));
    } else {
      Object.entries(filters).forEach(([k, v]) => {
        if (v && !k.startsWith('_')) query[k] = v;
      });
    }

    const total = await Model.countDocuments(query);
    const items = await Model.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate(Object.keys(Model.schema.paths).filter(p => Model.schema.paths[p].options && Model.schema.paths[p].options.ref))
      .lean();

    res.json({
      success: true,
      data: items,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) },
    });
  } catch (err) { next(err); }
};

exports.getById = (modelName) => async (req, res, next) => {
  try {
    const Model = mongoose.model(modelName);
    const item = await Model.findById(req.params.id)
      .populate(Object.keys(Model.schema.paths).filter(p => Model.schema.paths[p].options && Model.schema.paths[p].options.ref))
      .lean();
    if (!item) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: item });
  } catch (err) { next(err); }
};

exports.create = (modelName) => async (req, res, next) => {
  try {
    const Model = mongoose.model(modelName);
    const item = await Model.create(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (err) { next(err); }
};

exports.update = (modelName) => async (req, res, next) => {
  try {
    const Model = mongoose.model(modelName);
    const item = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: item });
  } catch (err) { next(err); }
};

exports.remove = (modelName) => async (req, res, next) => {
  try {
    const Model = mongoose.model(modelName);
    const item = await Model.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (err) { next(err); }
};

exports.getDashboardStats = async (req, res, next) => {
  try {
    const Associate = mongoose.model('Associate');
    const Staff = mongoose.model('Staff');
    const Client = mongoose.model('Client');
    const Project = mongoose.model('Project');
    const Task = mongoose.model('Task');
    const Finance = mongoose.model('Finance');
    const Lead = mongoose.model('Lead');
    const Ticket = mongoose.model('Ticket');

    const now = new Date();
    const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalAssociates, activeAssociates,
      totalStaff, totalStaffActive,
      totalClients, activeClients,
      totalProjects, activeProjects,
      totalTasks, pendingTasks,
      totalLeads, newLeadsThisMonth,
      totalTickets, openTickets,
      totalRevenue, monthlyRevenue,
      totalExpenses, monthlyExpenses,
      projectsByStatus,
      tasksByStatus,
      revenueByMonth,
    ] = await Promise.all([
      Associate.countDocuments(), Associate.countDocuments({ status: 'active' }),
      Staff.countDocuments(), Staff.countDocuments({ status: 'active' }),
      Client.countDocuments(), Client.countDocuments({ status: 'active' }),
      Project.countDocuments(), Project.countDocuments({ status: { $in: ['planning','in-progress','review'] } }),
      Task.countDocuments(), Task.countDocuments({ status: { $ne: 'done' } }),
      Lead.countDocuments(), Lead.countDocuments({ createdAt: { $gte: firstOfMonth } }),
      Ticket.countDocuments(), Ticket.countDocuments({ status: { $in: ['open','in-progress','waiting'] } }),
      Finance.aggregate([{ $match: { type: 'income', status: 'paid' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
      Finance.aggregate([{ $match: { type: 'income', status: 'paid', createdAt: { $gte: firstOfMonth } } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
      Finance.aggregate([{ $match: { type: 'expense', status: 'paid' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
      Finance.aggregate([{ $match: { type: 'expense', status: 'paid', createdAt: { $gte: firstOfMonth } } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
      Project.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Task.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Finance.aggregate([
        { $match: { type: 'income', status: 'paid', createdAt: { $gte: new Date(now.getFullYear(), now.getMonth() - 11, 1) } } },
        { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, revenue: { $sum: '$amount' } } },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
      ]),
    ]);

    const revenueTrends = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      const found = revenueByMonth.find(r => `${r._id.year}-${String(r._id.month).padStart(2, '0')}` === key);
      revenueTrends.push({ label, revenue: found ? found.revenue : 0 });
    }

    res.json({
      success: true,
      data: {
        overview: {
          totalAssociates, activeAssociates,
          totalStaff, totalStaffActive,
          totalClients, activeClients,
          totalProjects, activeProjects,
          totalTasks, pendingTasks,
          totalLeads, newLeadsThisMonth,
          totalTickets, openTickets,
          totalRevenue: totalRevenue[0]?.total || 0,
          monthlyRevenue: monthlyRevenue[0]?.total || 0,
          totalExpenses: totalExpenses[0]?.total || 0,
          monthlyExpenses: monthlyExpenses[0]?.total || 0,
        },
        projectsByStatus: projectsByStatus.reduce((acc, p) => { acc[p._id] = p.count; return acc; }, {}),
        tasksByStatus: tasksByStatus.reduce((acc, t) => { acc[t._id] = t.count; return acc; }, {}),
        revenueTrends,
      },
    });
  } catch (err) { next(err); }
};
