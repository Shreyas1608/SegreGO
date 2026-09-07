const Complaint = require('../models/Complaint');
const Notification = require('../models/Notification');

exports.createComplaint = async (req, res, next) => {
  try {
    const { category, description, priority, location, coordinates, imageUrl } = req.body;
    if (!category || !description) return res.status(400).json({ message: 'Category and description are required' });
    const complaint = await Complaint.create({
      userId: req.user._id, category, description,
      priority: priority || 'medium', location, coordinates, imageUrl,
    });
    await Notification.create({
      userId: req.user._id,
      title: '🎫 Complaint Registered',
      message: `Your complaint ${complaint.ticketId} has been submitted successfully.`,
      type: 'complaint', referenceId: complaint.ticketId,
    });
    res.status(201).json(complaint);
  } catch (err) { next(err); }
};

exports.getMyComplaints = async (req, res, next) => {
  try {
    const complaints = await Complaint.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) { next(err); }
};

exports.getAllComplaints = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.priority) filter.priority = req.query.priority;
    const complaints = await Complaint.find(filter).populate('userId', 'name email').sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) { next(err); }
};

exports.updateComplaintStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const complaint = await Complaint.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
    await Notification.create({
      userId: complaint.userId, title: '📋 Complaint Updated',
      message: `Your complaint ${complaint.ticketId} status changed to: ${status}`,
      type: 'complaint', referenceId: complaint.ticketId,
    });
    res.json(complaint);
  } catch (err) { next(err); }
};
