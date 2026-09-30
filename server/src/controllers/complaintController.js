const Complaint = require('../models/Complaint');
const Notification = require('../models/Notification');
const RewardTransaction = require('../models/RewardTransaction');
const User = require('../models/User');

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
    const complaints = await Complaint.find(filter).populate('userId', 'name email points level').sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) { next(err); }
};

exports.updateComplaintStatus = async (req, res, next) => {
  try {
    const { status, assignedOfficer, resolutionNote } = req.body;
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    const previousStatus = complaint.status;
    if (status) complaint.status = status;
    if (assignedOfficer !== undefined) complaint.assignedOfficer = assignedOfficer;
    if (resolutionNote !== undefined) complaint.resolutionNote = resolutionNote;

    if (status === 'resolved' && previousStatus !== 'resolved') {
      complaint.resolvedAt = new Date();

      // Auto-reward citizen +20 Eco Points upon ticket resolution!
      const citizen = await User.findById(complaint.userId);
      if (citizen) {
        citizen.points += 20;
        await citizen.save();

        await RewardTransaction.create({
          userId: citizen._id,
          action: 'Complaint Resolved',
          points: 20,
          reason: `Civic issue ${complaint.ticketId} resolved by BBMP field officer`,
          verificationStatus: 'verified',
        });
      }
    }

    await complaint.save();

    await Notification.create({
      userId: complaint.userId,
      title: status === 'resolved' ? '🎉 Ticket Resolved!' : '📋 Ticket Status Updated',
      message: status === 'resolved' 
        ? `Your civic ticket ${complaint.ticketId} has been resolved! You earned +20 Eco Points.` 
        : `Your ticket ${complaint.ticketId} status changed to: ${complaint.status}`,
      type: 'complaint',
      referenceId: complaint.ticketId,
    });

    res.json(complaint);
  } catch (err) { next(err); }
};
