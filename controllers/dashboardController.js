const Contact = require('../models/Contact');
const Career = require('../models/Career');

exports.getDashboard = async (req, res, next) => {
  try {
    const now = new Date();
    const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);

    const [
      totalContacts,
      totalApplications,
      monthContacts,
      monthApplications,
      contactsByType,
      positions,
      recentContacts,
      recentApplications,
      monthlyTrends,
      unreadCount,
      insights,
    ] = await Promise.all([
      Contact.countDocuments(),
      Career.countDocuments(),
      Contact.countDocuments({ createdAt: { $gte: firstOfMonth } }),
      Career.countDocuments({ createdAt: { $gte: firstOfMonth } }),
      Contact.aggregate([
        { $group: { _id: '$type', count: { $sum: 1 } } },
      ]),
      Career.aggregate([
        { $group: { _id: '$position', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Contact.find().sort({ createdAt: -1 }).limit(10).lean(),
      Career.find().sort({ createdAt: -1 }).limit(10).lean(),
      Contact.aggregate([
        { $match: { createdAt: { $gte: twelveMonthsAgo } } },
        {
          $group: {
            _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
            contacts: { $sum: 1 },
          },
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
      ]),
      Contact.countDocuments({ $or: [{ read: { $exists: false } }, { read: false }] }),
      (async () => {
        const allContacts = await Contact.find().sort({ createdAt: -1 }).lean();
        const dayCounts = {};
        const industryCounts = {};
        let total = 0;
        for (const c of allContacts) {
          total++;
          const d = c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-US', { weekday: 'long' }) : 'Unknown';
          dayCounts[d] = (dayCounts[d] || 0) + 1;
          const ind = c.metadata?.industry;
          if (ind) industryCounts[ind] = (industryCounts[ind] || 0) + 1;
        }
        const busiestDay = Object.entries(dayCounts).sort((a, b) => b[1] - a[1])[0] || ['—', 0];
        const topIndustry = Object.entries(industryCounts).sort((a, b) => b[1] - a[1])[0] || ['—', 0];
        const avgPerDay = total > 0 ? (total / Math.max(1, (now - new Date(allContacts[allContacts.length - 1]?.createdAt || now)) / 86400000)).toFixed(1) : '0';
        return { busiestDay: busiestDay[0], busiestDayCount: busiestDay[1], topIndustry: topIndustry[0], topIndustryCount: topIndustry[1], avgPerDay };
      })(),
    ]);

    // Build month labels for all 12 months
    const trendMap = {};
    for (const t of monthlyTrends) {
      const key = `${t._id.year}-${String(t._id.month).padStart(2, '0')}`;
      trendMap[key] = t.contacts;
    }
    const trends = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      trends.push({ label, count: trendMap[key] || 0 });
    }

    res.json({
      success: true,
      data: {
        overview: {
          totalContacts,
          totalApplications,
          monthContacts,
          monthApplications,
          unreadCount,
        },
        contactsByType: contactsByType.reduce((acc, c) => {
          acc[c._id] = c.count;
          return acc;
        }, {}),
        positions: positions.map(p => ({ position: p._id, count: p.count })),
        recentContacts,
        recentApplications,
        monthlyTrends: trends,
        insights,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.exportContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 }).lean();
    const typeMap = { rfp: 'Request for Proposal', consultation: 'Book Consultation', general: 'General Inquiry' };
    const csv = [
      ['Name', 'Email', 'Phone', 'Company', 'Type', 'Message', 'Service Interests', 'Metadata', 'Date', 'Read'].join(','),
      ...contacts.map(c => [
        `"${(c.name || '').replace(/"/g, '""')}"`,
        `"${c.email}"`,
        `"${c.phone || ''}"`,
        `"${c.company || ''}"`,
        `"${typeMap[c.type] || c.type}"`,
        `"${(c.message || '').replace(/"/g, '""')}"`,
        `"${(c.serviceInterests || []).join('; ')}"`,
        `"${c.metadata ? JSON.stringify(c.metadata).replace(/"/g, '""') : ''}"`,
        c.createdAt ? new Date(c.createdAt).toISOString() : '',
        c.read ? 'Yes' : 'No',
      ].join(',')),
    ].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="contacts-export.csv"');
    res.send(csv);
  } catch (err) {
    next(err);
  }
};

exports.exportApplications = async (req, res, next) => {
  try {
    const apps = await Career.find().sort({ createdAt: -1 }).lean();
    const csv = [
      ['Full Name', 'Email', 'Phone', 'Position', 'Cover Letter', 'Date'].join(','),
      ...apps.map(a => [
        `"${(a.fullName || '').replace(/"/g, '""')}"`,
        `"${a.email}"`,
        `"${a.phone || ''}"`,
        `"${(a.position || '').replace(/"/g, '""')}"`,
        `"${(a.coverLetter || '').replace(/"/g, '""')}"`,
        a.createdAt ? new Date(a.createdAt).toISOString() : '',
      ].join(',')),
    ].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="applications-export.csv"');
    res.send(csv);
  } catch (err) {
    next(err);
  }
};
