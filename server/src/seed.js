require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Bin = require('./models/Bin');
const RecyclingCenter = require('./models/RecyclingCenter');
const Collection = require('./models/Collection');
const Complaint = require('./models/Complaint');
const WasteScan = require('./models/WasteScan');
const RewardTransaction = require('./models/RewardTransaction');
const Notification = require('./models/Notification');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecosort';

async function seedDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    await Promise.all([
      User.deleteMany({}), Bin.deleteMany({}), RecyclingCenter.deleteMany({}),
      Collection.deleteMany({}), Complaint.deleteMany({}), WasteScan.deleteMany({}),
      RewardTransaction.deleteMany({}), Notification.deleteMany({}),
    ]);
    console.log('Cleared existing data.');

    const pw = await bcrypt.hash('Demo@123', 10);
    const apw = await bcrypt.hash('Admin@123', 10);
    const admin = await User.create({ name: 'Admin User', email: 'admin@ecosort.ai', password: apw, role: 'admin', points: 500, level: '♻️ Recycling Champion', scansCount: 25 });
    const demo = await User.create({ name: 'Rahul Sharma', email: 'demo@ecosort.ai', password: pw, role: 'citizen', points: 220, scansCount: 12, co2SavedKg: 4.8, streakDays: 5, level: '🌿 Green Citizen', correctSegregationPercent: 94 });
    const jane = await User.create({ name: 'Priya Patel', email: 'jane@ecosort.ai', password: pw, role: 'citizen', points: 85, scansCount: 6, co2SavedKg: 1.9, streakDays: 3, level: '🌱 Eco Starter' });
    console.log('Users seeded.');

    await Bin.insertMany([
      { binId: 'BIN-001', locationName: 'Electronic City Phase 1', area: 'Central Zone', type: 'recyclable', fillLevel: 72, temperature: 31, batteryLevel: 88, status: 'almost-full', deviceId: 'ESP32-001', coordinates: { lat: 12.845, lng: 77.663 } },
      { binId: 'BIN-002', locationName: 'Koramangala 4th Block', area: 'Central Zone', type: 'organic', fillLevel: 91, temperature: 34, batteryLevel: 65, status: 'full', deviceId: 'ESP32-002', coordinates: { lat: 12.935, lng: 77.612 } },
      { binId: 'BIN-003', locationName: 'Indiranagar Metro Station', area: 'East Zone', type: 'general', fillLevel: 43, temperature: 28, batteryLevel: 95, status: 'available', deviceId: 'ESP32-003', coordinates: { lat: 12.978, lng: 77.641 } },
      { binId: 'BIN-004', locationName: 'HSR Layout Sector 2', area: 'Central Zone', type: 'e-waste', fillLevel: 25, temperature: 27, batteryLevel: 92, status: 'available', deviceId: 'ESP32-004', coordinates: { lat: 12.912, lng: 77.638 } },
      { binId: 'BIN-005', locationName: 'Whitefield IT Park', area: 'East Zone', type: 'hazardous', fillLevel: 88, temperature: 36, batteryLevel: 45, status: 'almost-full', deviceId: 'ESP32-005', coordinates: { lat: 12.977, lng: 77.729 } },
    ]);
    console.log('Smart bins seeded.');

    await RecyclingCenter.insertMany([
      { name: 'Green Earth Recycling Hub', type: 'recycling', address: 'Electronic City Phase 2, Bengaluru', wasteAccepted: ['Plastic', 'Paper', 'Metal', 'Glass'], openingHours: 'Mon-Sat: 9:00 AM - 6:00 PM', phone: 'Contact local authority', distanceKm: 1.2, coordinates: { lat: 12.851, lng: 77.671 } },
      { name: 'E-Waste Solutions Center', type: 'e-waste', address: 'Koramangala 5th Block, Bengaluru', wasteAccepted: ['E-Waste', 'Batteries', 'Electronics'], openingHours: 'Mon-Fri: 10:00 AM - 5:00 PM', phone: 'Contact local authority', distanceKm: 2.8, coordinates: { lat: 12.934, lng: 77.615 } },
      { name: 'City Compost Facility', type: 'composting', address: 'Marathahalli, Bengaluru', wasteAccepted: ['Organic Waste', 'Food Waste', 'Garden Waste'], openingHours: 'Mon-Sat: 7:00 AM - 4:00 PM', phone: 'Contact local authority', distanceKm: 3.5, coordinates: { lat: 12.957, lng: 77.702 } },
      { name: 'Hazardous Waste Facility', type: 'hazardous', address: 'Peenya Industrial Area, Bengaluru', wasteAccepted: ['Chemical Waste', 'Medical Waste', 'Batteries'], openingHours: 'Mon-Fri: 9:00 AM - 3:00 PM', phone: 'Contact local authority', distanceKm: 8.1, coordinates: { lat: 13.029, lng: 77.523 } },
      { name: 'Municipal Dry Waste Center', type: 'dry-waste', address: 'HSR Layout, Bengaluru', wasteAccepted: ['Paper', 'Cardboard', 'Plastic', 'Metal'], openingHours: 'Mon-Sat: 8:00 AM - 5:00 PM', phone: 'Contact local authority', distanceKm: 1.8, coordinates: { lat: 12.914, lng: 77.635 } },
    ]);
    console.log('Recycling centers seeded.');

    const today = new Date();
    await Collection.insertMany([
      { type: 'dry-waste', scheduleDate: new Date(today.getTime() + 86400000), scheduleTime: '8:00 AM - 10:00 AM', area: 'Central Zone', status: 'scheduled', vehicleNumber: 'ECO-VH-001' },
      { type: 'wet-waste', scheduleDate: new Date(today.getTime() + 172800000), scheduleTime: '7:00 AM - 9:00 AM', area: 'Central Zone', status: 'scheduled', vehicleNumber: 'ECO-VH-002' },
      { type: 'recyclable', scheduleDate: new Date(today.getTime() + 259200000), scheduleTime: '9:00 AM - 11:00 AM', area: 'East Zone', status: 'scheduled', vehicleNumber: 'ECO-VH-003' },
      { type: 'e-waste', scheduleDate: new Date(today.getTime() + 432000000), scheduleTime: '10:00 AM - 12:00 PM', area: 'Central Zone', status: 'scheduled', vehicleNumber: 'ECO-VH-004' },
      { type: 'hazardous', scheduleDate: new Date(today.getTime() + 604800000), scheduleTime: '8:00 AM - 10:00 AM', area: 'East Zone', status: 'scheduled', vehicleNumber: 'ECO-VH-005' },
    ]);
    console.log('Collections seeded.');

    await Complaint.create({ userId: demo._id, category: 'garbage-overflow', description: 'Garbage bin near Electronic City bus stop is overflowing for 2 days.', priority: 'high', status: 'assigned', location: 'Electronic City Bus Stop' });
    await Complaint.create({ userId: demo._id, category: 'illegal-dumping', description: 'Construction debris dumped on roadside near park.', priority: 'critical', status: 'submitted', location: 'Koramangala 4th Block Park' });
    await Complaint.create({ userId: jane._id, category: 'missed-collection', description: 'Dry waste collection missed this week.', priority: 'medium', status: 'in-progress', location: 'HSR Layout Sector 2' });
    console.log('Complaints seeded.');

    const scanCategories = ['Plastic', 'Paper', 'Biodegradable', 'Metal', 'Glass'];
    for (let i = 0; i < 5; i++) {
      await WasteScan.create({
        userId: demo._id, imageHash: `demo-hash-${i}-${Date.now()}`,
        category: scanCategories[i], material: `Demo ${scanCategories[i]} Item`,
        confidence: 0.9 + Math.random() * 0.09, recommendedBin: 'Blue (Recyclable)',
        disposalInstructions: 'Place in the appropriate bin after cleaning.',
        pointsAwarded: 10 + i * 3, isVerified: true,
      });
    }
    console.log('Waste scans seeded.');

    await RewardTransaction.insertMany([
      { userId: demo._id, action: 'AI Waste Scan', points: 15, reason: 'PET Plastic Bottle classified (96%)', verificationStatus: 'verified' },
      { userId: demo._id, action: 'AI Waste Scan', points: 20, reason: 'Aluminum Can classified (97%)', verificationStatus: 'verified' },
      { userId: demo._id, action: 'Quiz Completed', points: 10, reason: 'Segregation basics quiz', verificationStatus: 'verified' },
      { userId: demo._id, action: 'Complaint Report', points: 5, reason: 'Verified garbage overflow report', verificationStatus: 'verified' },
      { userId: demo._id, action: 'AI Waste Scan', points: 12, reason: 'Cardboard Box classified (93%)', verificationStatus: 'verified' },
    ]);
    console.log('Reward transactions seeded.');

    await Notification.insertMany([
      { userId: demo._id, title: '🎉 Points Earned!', message: 'You earned 15 Eco Points for correctly identifying a Plastic Bottle.', type: 'reward' },
      { userId: demo._id, title: '🚛 Collection Tomorrow', message: 'Dry waste collection is scheduled for tomorrow (8:00-10:00 AM).', type: 'collection' },
      { userId: demo._id, title: '📋 Complaint Updated', message: 'Your complaint ECO-2026-00001 has been assigned to a field officer.', type: 'complaint' },
      { userId: demo._id, title: '🏆 Level Up!', message: 'Congratulations! You have reached Green Citizen level.', type: 'level-up' },
    ]);
    console.log('Notifications seeded.');

    console.log('\n✅ Seed complete!');
    console.log('Demo credentials:');
    console.log('  Citizen: demo@ecosort.ai / Demo@123');
    console.log('  Admin:   admin@ecosort.ai / Admin@123');
    return true;
  } catch (err) {
    console.error('Seed error:', err);
    throw err;
  }
}

if (require.main === module) {
  seedDB().then(() => process.exit(0)).catch(() => process.exit(1));
}

module.exports = seedDB;
