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
const Voucher = require('./models/Voucher');

async function seedDB(customUri) {
  try {
    let targetUri = customUri || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecosort';
    if (mongoose.connection.readyState === 0) {
      try {
        await mongoose.connect(targetUri, { serverSelectionTimeoutMS: 2000 });
        console.log('Connected to local MongoDB for seeding...');
      } catch (err) {
        console.log('Local MongoDB not running. Starting In-Memory MongoDB for seeding...');
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongoServer = await MongoMemoryServer.create();
        targetUri = mongoServer.getUri();
        await mongoose.connect(targetUri);
        console.log('Connected to Auto-Fallback In-Memory MongoDB for seeding...');
      }
    } else {
      console.log('Using existing MongoDB connection for seeding...');
    }

    await Promise.all([
      User.deleteMany({}),
      Bin.deleteMany({}),
      RecyclingCenter.deleteMany({}),
      Collection.deleteMany({}),
      Complaint.deleteMany({}),
      WasteScan.deleteMany({}),
      RewardTransaction.deleteMany({}),
      Notification.deleteMany({}),
      Voucher.deleteMany({}),
    ]);
    console.log('Cleared existing data.');

    const pw = await bcrypt.hash('Demo@123', 10);
    const apw = await bcrypt.hash('Admin@123', 10);

    const admin = await User.create({
      name: 'BBMP Municipal Admin',
      email: 'admin@ecosort.ai',
      password: apw,
      role: 'admin',
      points: 500,
      level: '♻️ Recycling Champion',
      scansCount: 25,
    });

    const demo = await User.create({
      name: 'Rahul Sharma',
      email: 'demo@ecosort.ai',
      password: pw,
      role: 'citizen',
      points: 220,
      scansCount: 12,
      co2SavedKg: 4.8,
      streakDays: 5,
      level: '🌿 Green Citizen',
      correctSegregationPercent: 94,
    });

    const jane = await User.create({
      name: 'Priya Patel',
      email: 'jane@ecosort.ai',
      password: pw,
      role: 'citizen',
      points: 85,
      scansCount: 6,
      co2SavedKg: 1.9,
      streakDays: 3,
      level: '🌱 Eco Starter',
    });

    console.log('Users seeded.');

    // ─── Bengaluru Smart Bins Telemetry Data ─────────────────────────
    await Bin.insertMany([
      {
        binId: 'BIN-BLR-001',
        locationName: 'Electronic City Phase 1 Bus Stand',
        area: 'South Zone (Ward 192)',
        type: 'recyclable',
        fillLevel: 72,
        temperature: 31,
        batteryLevel: 88,
        status: 'almost-full',
        deviceId: 'ESP32-BLR-001',
        coordinates: { lat: 12.8452, lng: 77.6602 },
      },
      {
        binId: 'BIN-BLR-002',
        locationName: 'Koramangala 80ft Road (Sony Signal)',
        area: 'South Zone (Ward 151)',
        type: 'organic',
        fillLevel: 94,
        temperature: 34,
        batteryLevel: 65,
        status: 'full',
        deviceId: 'ESP32-BLR-002',
        coordinates: { lat: 12.9352, lng: 77.6245 },
      },
      {
        binId: 'BIN-BLR-003',
        locationName: 'Indiranagar 100ft Road Metro Station',
        area: 'East Zone (Ward 80)',
        type: 'general',
        fillLevel: 43,
        temperature: 28,
        batteryLevel: 95,
        status: 'available',
        deviceId: 'ESP32-BLR-003',
        coordinates: { lat: 12.9784, lng: 77.6387 },
      },
      {
        binId: 'BIN-BLR-004',
        locationName: 'HSR Layout Sector 2 BDA Complex',
        area: 'South Zone (Ward 174)',
        type: 'e-waste',
        fillLevel: 25,
        temperature: 27,
        batteryLevel: 92,
        status: 'available',
        deviceId: 'ESP32-BLR-004',
        coordinates: { lat: 12.9116, lng: 77.6389 },
      },
      {
        binId: 'BIN-BLR-005',
        locationName: 'Whitefield Forum Shantiniketan Gate',
        area: 'Mahadevapura Zone (Ward 85)',
        type: 'hazardous',
        fillLevel: 88,
        temperature: 36,
        batteryLevel: 45,
        status: 'almost-full',
        deviceId: 'ESP32-BLR-005',
        coordinates: { lat: 12.9863, lng: 77.7289 },
      },
      {
        binId: 'BIN-BLR-006',
        locationName: 'Malleshwaram 18th Cross Bus Terminal',
        area: 'West Zone (Ward 45)',
        type: 'organic',
        fillLevel: 38,
        temperature: 26,
        batteryLevel: 98,
        status: 'available',
        deviceId: 'ESP32-BLR-006',
        coordinates: { lat: 13.0068, lng: 77.5684 },
      },
      {
        binId: 'BIN-BLR-007',
        locationName: 'MG Road Boulevard Near Metro Station',
        area: 'Central Zone (Ward 111)',
        type: 'recyclable',
        fillLevel: 62,
        temperature: 29,
        batteryLevel: 91,
        status: 'available',
        deviceId: 'ESP32-BLR-007',
        coordinates: { lat: 12.9756, lng: 77.6066 },
      },
    ]);
    console.log('Bengaluru Smart Bins seeded.');

    // ─── Bengaluru Recycling & Collection Centers ──────────────────
    await RecyclingCenter.insertMany([
      {
        name: 'Koramangala Dry Waste Collection Center (DWCC)',
        type: 'dry-waste',
        address: '4th Block, Koramangala, Bengaluru, Karnataka 560034',
        wasteAccepted: ['Paper', 'Cardboard', 'Plastic Bottles', 'Metal Cans'],
        openingHours: 'Mon-Sat: 8:00 AM - 5:00 PM',
        phone: '+91 80 2297 5555',
        distanceKm: 1.4,
        coordinates: { lat: 12.9341, lng: 77.6152 },
      },
      {
        name: 'Electronic City E-Waste Recycling Hub',
        type: 'e-waste',
        address: 'Phase 2 Industrial Area, Electronic City, Bengaluru 560100',
        wasteAccepted: ['Laptops', 'Mobile Phones', 'Batteries', 'Circuit Boards', 'Chargers'],
        openingHours: 'Mon-Fri: 9:30 AM - 6:00 PM',
        phone: '+91 80 4110 9988',
        distanceKm: 2.8,
        coordinates: { lat: 12.8512, lng: 77.6714 },
      },
      {
        name: 'Hasiru Dala Community Compost Yard',
        type: 'composting',
        address: 'Banashankari 2nd Stage, Bengaluru, Karnataka 560070',
        wasteAccepted: ['Organic Food Waste', 'Garden Scraps', 'Fruit & Veg Peels'],
        openingHours: 'Mon-Sat: 7:00 AM - 4:00 PM',
        phone: '+91 80 2671 1234',
        distanceKm: 3.2,
        coordinates: { lat: 12.9254, lng: 77.5689 },
      },
      {
        name: 'BBMP Hazardous & Medical Waste Depot',
        type: 'hazardous',
        address: 'Peenya 3rd Phase Industrial Area, Bengaluru 560058',
        wasteAccepted: ['Paints', 'Chemical Solvents', 'Medical Waste', 'Fluorescent Tubes'],
        openingHours: 'Mon-Fri: 9:00 AM - 4:00 PM',
        phone: '+91 80 2839 4400',
        distanceKm: 7.5,
        coordinates: { lat: 13.0294, lng: 77.5218 },
      },
      {
        name: 'HSR Layout Sector 5 Recycling Kiosk',
        type: 'recycling',
        address: '27th Main Rd, HSR Layout Sector 5, Bengaluru 560102',
        wasteAccepted: ['PET Bottles', 'Aluminum Cans', 'Glass Bottles', 'Textiles'],
        openingHours: 'Mon-Sun: 8:00 AM - 8:00 PM',
        phone: '+91 80 2572 6633',
        distanceKm: 1.9,
        coordinates: { lat: 12.9142, lng: 77.6358 },
      },
    ]);
    console.log('Bengaluru Recycling Centers seeded.');

    // ─── Collection Schedules ──────────────────────────────────────
    const today = new Date();
    await Collection.insertMany([
      {
        type: 'dry-waste',
        scheduleDate: new Date(today.getTime() + 86400000),
        scheduleTime: '8:00 AM - 10:00 AM',
        area: 'Koramangala Ward 151',
        status: 'scheduled',
        vehicleNumber: 'KA-01-ECO-101',
      },
      {
        type: 'wet-waste',
        scheduleDate: new Date(today.getTime() + 172800000),
        scheduleTime: '7:00 AM - 9:00 AM',
        area: 'HSR Layout Ward 174',
        status: 'scheduled',
        vehicleNumber: 'KA-01-ECO-102',
      },
      {
        type: 'recyclable',
        scheduleDate: new Date(today.getTime() + 259200000),
        scheduleTime: '9:00 AM - 11:00 AM',
        area: 'Indiranagar Ward 80',
        status: 'scheduled',
        vehicleNumber: 'KA-01-ECO-103',
      },
      {
        type: 'e-waste',
        scheduleDate: new Date(today.getTime() + 432000000),
        scheduleTime: '10:00 AM - 12:00 PM',
        area: 'Electronic City Ward 192',
        status: 'scheduled',
        vehicleNumber: 'KA-01-ECO-104',
      },
    ]);
    console.log('Collections seeded.');

    // ─── Complaints ────────────────────────────────────────────────
    await Complaint.create({
      userId: demo._id,
      category: 'garbage-overflow',
      description: 'Garbage bin near Electronic City Phase 1 bus stop is overflowing onto footpaths.',
      priority: 'high',
      status: 'assigned',
      location: 'Electronic City Phase 1 Bus Stop',
    });
    await Complaint.create({
      userId: demo._id,
      category: 'illegal-dumping',
      description: 'Construction debris dumped on roadside near 80ft road park entrance.',
      priority: 'critical',
      status: 'submitted',
      location: 'Koramangala 4th Block Park',
    });
    await Complaint.create({
      userId: jane._id,
      category: 'missed-collection',
      description: 'Door-to-door dry waste collection vehicle missed Sector 2 this Tuesday.',
      priority: 'medium',
      status: 'in-progress',
      location: 'HSR Layout Sector 2',
    });
    console.log('Complaints seeded.');

    // ─── Waste Scans ───────────────────────────────────────────────
    const scanCategories = ['Plastic', 'Paper', 'Biodegradable', 'Metal', 'Glass'];
    for (let i = 0; i < 5; i++) {
      await WasteScan.create({
        userId: demo._id,
        imageHash: `demo-hash-${i}-${Date.now()}`,
        category: scanCategories[i],
        material: `Demo ${scanCategories[i]} Item`,
        confidence: 0.92 + i * 0.015,
        recommendedBin: scanCategories[i] === 'Biodegradable' ? '🟢 Green Bin' : '🔵 Blue Bin',
        disposalInstructions: 'Place in appropriate municipal bin after rinsing clean.',
        pointsAwarded: 15,
        isVerified: true,
      });
    }
    console.log('Waste scans seeded.');

    // ─── Reward Transactions Ledger ────────────────────────────────
    await RewardTransaction.insertMany([
      { userId: demo._id, action: 'AI Waste Scan', points: 15, reason: 'PET Plastic Bottle classified (96%)', verificationStatus: 'verified' },
      { userId: demo._id, action: 'AI Waste Scan', points: 20, reason: 'Aluminum Can classified (97%)', verificationStatus: 'verified' },
      { userId: demo._id, action: 'Quiz Completed', points: 10, reason: 'Waste segregation rules quiz', verificationStatus: 'verified' },
      { userId: demo._id, action: 'Complaint Report', points: 15, reason: 'Verified overflow report at E-City', verificationStatus: 'verified' },
      { userId: demo._id, action: 'AI Waste Scan', points: 15, reason: 'Cardboard Box classified (94%)', verificationStatus: 'verified' },
    ]);

    // ─── Reward Vouchers Catalog ───────────────────────────────────
    await Voucher.insertMany([
      {
        title: '🚌 Namma Metro 20% Discount Pass',
        description: 'Get 20% discount on Namma Metro Smart Card recharge for public transit.',
        pointsCost: 50,
        category: 'transit',
        icon: '🚆',
        discountValue: '20% OFF Metro Pass',
        terms: 'Valid for 30 days. Redeemable on Namma Metro App.',
      },
      {
        title: '🌱 Eco Compost Starter Kit',
        description: '100% Organic home composting bin & bio-inoculant powder package.',
        pointsCost: 100,
        category: 'eco-product',
        icon: '🪴',
        discountValue: 'Free Home Compost Kit',
        terms: 'Free delivery across Bengaluru municipal wards.',
      },
      {
        title: '🛍️ Zero-Waste Store Voucher',
        description: '₹200 discount at participating organic grocery and plastic-free stores.',
        pointsCost: 150,
        category: 'shopping',
        icon: '🛒',
        discountValue: '₹200 Store Voucher',
        terms: 'Valid at Green Basket, Organic World, and Earth Store.',
      },
      {
        title: '⚡ BESCOM Solar Utility Bill Credit',
        description: '₹300 rebate credit on monthly household electricity utility bill.',
        pointsCost: 250,
        category: 'utility',
        icon: '💡',
        discountValue: '₹300 Electricity Credit',
        terms: 'Applicable for domestic BESCOM electricity accounts.',
      },
    ]);
    console.log('Reward vouchers catalog seeded.');

    // ─── Notifications ─────────────────────────────────────────────
    await Notification.insertMany([
      { userId: demo._id, title: '🎉 Welcome to SEGREGO!', message: 'Start scanning waste to earn Eco Points and level up.', type: 'reward' },
      { userId: demo._id, title: '🚛 Collection Schedule Alert', message: 'Dry waste collection scheduled for Koramangala tomorrow (8-10 AM).', type: 'collection' },
      { userId: demo._id, title: '📋 Ticket Assigned', message: 'Your complaint ECO-BLR-001 has been assigned to field team.', type: 'complaint' },
      { userId: demo._id, title: '🌿 Level Up!', message: 'You reached Green Citizen status with 220 Eco Points!', type: 'level-up' },
    ]);
    console.log('Notifications seeded.');

    console.log('\n✅ Database seed complete!');
    console.log('Demo Credentials:');
    console.log('  Citizen Account: demo@ecosort.ai / Demo@123');
    console.log('  BBMP Admin:      admin@ecosort.ai / Admin@123');
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
