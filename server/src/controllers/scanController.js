const WasteScan = require('../models/WasteScan');
const RewardTransaction = require('../models/RewardTransaction');
const Notification = require('../models/Notification');
const User = require('../models/User');

// ─── Extended Classification Database ────────────────────────────────────────
const CLASSIFICATION_DB = {
  Biodegradable: {
    category: 'Biodegradable',
    material: 'Food Waste / Organic / Wet Waste',
    confidence: 0.94,
    recommendedBin: '🟢 Green Bin (Organic / Wet Waste)',
    disposalInstructions: 'Place in the Green Bin. Drain excess gravy/liquid. Keep separated from dry recyclable plastics. Excellent for home or community composting.',
    environmentalImpact: 'Composting organic waste prevents methane emissions in landfills and creates nutrient-rich soil.',
    points: 15,
  },
  Plastic: {
    category: 'Plastic',
    material: 'PET Plastic Bottle / Plastic Wrapper / Packaging',
    confidence: 0.95,
    recommendedBin: '🔵 Blue Bin (Dry / Recyclables)',
    disposalInstructions: 'Rinse container clean of residues, remove the cap, crush bottle to save volume, and deposit into the Blue Bin.',
    environmentalImpact: 'Recycling 1 ton of plastic saves 5,774 kWh of electricity and prevents 450+ years of ocean pollution.',
    points: 15,
  },
  Paper: {
    category: 'Paper',
    material: 'Cardboard / Paper / Newspaper',
    confidence: 0.93,
    recommendedBin: '🔵 Blue Bin (Dry / Recyclables)',
    disposalInstructions: 'Ensure paper is dry and clean. Flatten boxes. Do NOT include greasy/food-soiled paper (soiled paper goes into Green Bin).',
    environmentalImpact: 'Recycling 1 ton of paper saves 17 mature trees, 26,000 litres of water, and 4,000 kWh of energy.',
    points: 12,
  },
  Glass: {
    category: 'Glass',
    material: 'Glass Bottle / Glass Jar',
    confidence: 0.96,
    recommendedBin: '🔵 Blue Bin (Dry / Recyclables)',
    disposalInstructions: 'Rinse thoroughly with water. Keep bottles intact. Wrap any broken glass safely in newspaper before disposal.',
    environmentalImpact: 'Glass is 100% recyclable indefinitely without any loss in purity or quality.',
    points: 18,
  },
  Metal: {
    category: 'Metal',
    material: 'Aluminium Can / Tin / Metal Scrap',
    confidence: 0.97,
    recommendedBin: '🔵 Blue Bin (Dry / Recyclables)',
    disposalInstructions: 'Rinse cans clean. Flatten or crush cans to save space. Deposit in the Blue Recyclable Bin.',
    environmentalImpact: 'Recycling aluminium uses 95% less energy than producing it from raw bauxite ore.',
    points: 20,
  },
  'E-Waste': {
    category: 'E-Waste',
    material: 'Electronic Device / Circuit Board / Charger',
    confidence: 0.95,
    recommendedBin: '🔴 Red Bin (E-Waste Collection Point)',
    disposalInstructions: 'Never mix with household trash. Take to an authorized E-Waste collection kiosk or municipal drop-off hub.',
    environmentalImpact: 'Proper e-waste disposal prevents toxic lead, mercury, and cadmium from leaching into groundwater.',
    points: 25,
  },
  Hazardous: {
    category: 'Hazardous',
    material: 'Battery / Chemical / Paint / Aerosol',
    confidence: 0.98,
    recommendedBin: '🔴 Red Bin (Hazardous Waste)',
    disposalInstructions: 'Never throw in regular trash. Take to a municipal hazardous waste collection drive or battery collection kiosk.',
    environmentalImpact: 'A single AA battery can contaminate up to 600,000 litres of water if thrown in a regular landfill.',
    points: 25,
  },
  Medical: {
    category: 'Medical',
    material: 'Medical Waste / Expired Medicine / Syringe',
    confidence: 0.96,
    recommendedBin: '⚪ White Bin (Medical / Biomedical Waste)',
    disposalInstructions: 'Return expired medicines to an authorized pharmacy. Place sharps in a puncture-proof container.',
    environmentalImpact: 'Controlled medical incineration eliminates dangerous pathogens and prevents contamination.',
    points: 25,
  },
  Textile: {
    category: 'Textile',
    material: 'Clothing / Fabric / Footwear',
    confidence: 0.90,
    recommendedBin: '🟡 Yellow Bin (Textile Collection)',
    disposalInstructions: 'Donate gently used clothing. Worn/torn textiles should be taken to a dedicated fabric recycling drop-off.',
    environmentalImpact: 'Textile reuse and recycling saves thousands of litres of water and cuts industrial carbon footprint.',
    points: 15,
  },
};

// ─── Keyword → Category Mapping ──────────────────────────────────────────────
const KEYWORD_MAP = [
  // Biodegradable / Wet Waste (includes 'ww' for wet waste, 'food', 'veg', etc.)
  {
    keywords: [
      'ww', 'wet', 'food', 'organic', 'vegetable', 'veg', 'fruit', 'banana', 'peel', 'peels',
      'leaf', 'leaves', 'grass', 'compost', 'kitchen', 'rice', 'rotten', 'leftover', 'leftovers',
      'onion', 'potato', 'tomato', 'curry', 'bread', 'apple', 'mango', 'orange', 'meal',
      'scrap', 'scraps', 'cooked', 'biodegradable', 'biowaste', 'salad', 'green waste', 'garden'
    ],
    category: 'Biodegradable'
  },
  // Plastic (includes 'dw' for dry waste, 'plastic', 'pet', etc.)
  {
    keywords: [
      'plastic', 'bottle', 'pet', 'wrapper', 'polythene', 'bag', 'sachet', 'container',
      'cup', 'straw', 'packaging', 'foam', 'styrofoam', 'poly', 'tetra', 'pouch', 'dw'
    ],
    category: 'Plastic'
  },
  // Paper
  {
    keywords: [
      'paper', 'cardboard', 'newspaper', 'book', 'magazine', 'carton', 'box', 'envelope',
      'tissue', 'napkin', 'document', 'sheet', 'folder', 'pamphlet', 'corrugated'
    ],
    category: 'Paper'
  },
  // Glass
  {
    keywords: ['glass', 'jar', 'bottle_glass', 'mirror', 'vase', 'glassware', 'window', 'bulb'],
    category: 'Glass'
  },
  // Metal
  {
    keywords: ['metal', 'can', 'aluminium', 'aluminum', 'tin', 'steel', 'iron', 'wire', 'scrap', 'foil', 'utensil', 'cookware'],
    category: 'Metal'
  },
  // E-Waste
  {
    keywords: ['ewaste', 'e_waste', 'electronic', 'electronics', 'phone', 'mobile', 'laptop', 'computer', 'circuit', 'keyboard', 'mouse', 'charger', 'cable', 'tv', 'monitor'],
    category: 'E-Waste'
  },
  // Hazardous
  {
    keywords: ['battery', 'chemical', 'paint', 'hazardous', 'toxic', 'pesticide', 'acid', 'bleach', 'oil', 'solvent'],
    category: 'Hazardous'
  },
  // Medical
  {
    keywords: ['medicine', 'medical', 'tablet', 'capsule', 'syringe', 'needle', 'bandage', 'glove', 'mask', 'pill'],
    category: 'Medical'
  },
  // Textile
  {
    keywords: ['cloth', 'textile', 'fabric', 'shirt', 'pant', 'clothes', 'dress', 'shoes', 'footwear', 'jean', 'sock'],
    category: 'Textile'
  },
];

const getLevel = (points) => {
  if (points >= 1500) return '🏆 Sustainability Leader';
  if (points >= 700) return '🌎 Eco Warrior';
  if (points >= 300) return '♻️ Recycling Champion';
  if (points >= 100) return '🌿 Green Citizen';
  return '🌱 Eco Starter';
};

// ─── Classification Decision Engine ──────────────────────────────────────────
function resolveCategory(fileName, userTag, visualCategory) {
  // 1. If explicit userTag matches any category
  if (userTag) {
    const tagLower = userTag.toLowerCase();
    for (const entry of KEYWORD_MAP) {
      if (entry.keywords.some(k => tagLower.includes(k))) {
        return { category: entry.category, method: 'user-tag' };
      }
    }
  }

  // 2. Check filename keywords (includes 'ww' for wet waste, 'wet', 'food', etc.)
  if (fileName) {
    const cleanName = fileName.toLowerCase().replace(/[^a-z0-9]/g, ' ');
    const tokens = cleanName.split(/\s+/).filter(Boolean);

    for (const entry of KEYWORD_MAP) {
      for (const kw of entry.keywords) {
        if (tokens.includes(kw) || cleanName.includes(kw)) {
          return { category: entry.category, method: 'filename-analysis' };
        }
      }
    }
  }

  // 3. Client-side visual pixel classifier from canvas
  if (visualCategory && CLASSIFICATION_DB[visualCategory]) {
    return { category: visualCategory, method: 'computer-vision' };
  }

  // 4. Default: If no signals, default to Biodegradable (organic food is the #1 household waste category: ~60%)
  return { category: 'Biodegradable', method: 'smart-default' };
}

// ─── Controller Methods ───────────────────────────────────────────────────────
exports.classifyWaste = async (req, res, next) => {
  try {
    const { imageHash, fileName, userTag, visualCategory, visualConfidence, visualStats } = req.body;
    if (!imageHash) return res.status(400).json({ message: 'imageHash is required' });

    // Anti-cheat: generous daily scan limit (100 per day for demo testing)
    const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
    const todayCount = await WasteScan.countDocuments({ userId: req.user._id, createdAt: { $gte: todayStart } });
    if (todayCount >= 100) {
      return res.status(429).json({ message: 'Daily test limit reached (100 scans/day).' });
    }

    // Resolve category with priority
    const { category, method } = resolveCategory(fileName, userTag, visualCategory);
    const result = CLASSIFICATION_DB[category];

    // Use visual confidence if available and realistic
    const finalConfidence = visualConfidence && visualConfidence > 0.7 ? visualConfidence : result.confidence;

    const scan = await WasteScan.create({
      userId: req.user._id,
      imageHash,
      category: result.category,
      material: result.material,
      confidence: finalConfidence,
      recommendedBin: result.recommendedBin,
      disposalInstructions: result.disposalInstructions,
      environmentalImpact: result.environmentalImpact,
      pointsAwarded: finalConfidence >= 0.85 ? result.points : 0,
    });

    // Update user points & statistics
    const user = await User.findById(req.user._id);
    user.points += scan.pointsAwarded;
    user.scansCount += 1;
    user.co2SavedKg = parseFloat((user.co2SavedKg + result.points * 0.15).toFixed(2));
    user.level = getLevel(user.points);
    await user.save();

    // Record reward ledger transaction
    if (scan.pointsAwarded > 0) {
      await RewardTransaction.create({
        userId: req.user._id,
        action: 'AI Waste Scan',
        points: scan.pointsAwarded,
        reason: `${result.material} detected via ${method} (${Math.round(finalConfidence * 100)}% confidence)`,
        verificationStatus: 'verified',
        referenceId: scan._id.toString(),
      });

      await Notification.create({
        userId: req.user._id,
        title: '🎉 Points Earned!',
        message: `You earned ${scan.pointsAwarded} Eco Points for correctly identifying ${result.material}.`,
        type: 'reward',
      });
    }

    res.json({
      ...result,
      confidence: finalConfidence,
      pointsAwarded: scan.pointsAwarded,
      scanId: scan._id,
      userPoints: user.points,
      userLevel: user.level,
      detectionMethod: method,
      visualStats: visualStats || null,
      isDemoMode: true,
    });
  } catch (err) { next(err); }
};

exports.getMyScans = async (req, res, next) => {
  try {
    const scans = await WasteScan.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(10);
    res.json(scans);
  } catch (err) { next(err); }
};

exports.getScanHistory = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const scans = await WasteScan.find({ userId: req.user._id }).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit);
    const total = await WasteScan.countDocuments({ userId: req.user._id });
    res.json({ scans, total, page, pages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
};
