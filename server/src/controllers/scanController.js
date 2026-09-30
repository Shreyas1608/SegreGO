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
    disposalInstructions: 'Place in the Green Bin. Drain excess liquids. Excellent for home or community composting.',
    environmentalImpact: 'Composting organic waste prevents methane emissions in landfills and creates nutrient-rich soil.',
    points: 15,
  },
  Plastic: {
    category: 'Plastic',
    material: 'Plastic Bag / PET Bottle / Wrapper / Packaging',
    confidence: 0.96,
    recommendedBin: '🔵 Blue Bin (Dry / Recyclables)',
    disposalInstructions: 'Rinse container or wrapper clean of residues. Place in the Blue Recyclable Bin or drop off at your local DWCC.',
    environmentalImpact: 'Recycling 1 ton of plastic saves 5,774 kWh of electricity and prevents ocean microplastics.',
    points: 15,
  },
  Paper: {
    category: 'Paper',
    material: 'Cardboard Box / Paper / Newspaper',
    confidence: 0.93,
    recommendedBin: '🔵 Blue Bin (Dry / Recyclables)',
    disposalInstructions: 'Ensure paper is dry and clean. Flatten boxes. Do NOT include greasy food-soiled paper.',
    environmentalImpact: 'Recycling 1 ton of paper saves 17 mature trees and 26,000 litres of water.',
    points: 12,
  },
  Glass: {
    category: 'Glass',
    material: 'Glass Bottle / Glass Jar',
    confidence: 0.96,
    recommendedBin: '🔵 Blue Bin (Dry / Recyclables)',
    disposalInstructions: 'Rinse clean with water. Keep bottles intact. Wrap broken glass safely in newspaper.',
    environmentalImpact: 'Glass is 100% recyclable indefinitely without loss in purity or quality.',
    points: 18,
  },
  Metal: {
    category: 'Metal',
    material: 'Aluminium Can / Tin / Metal Scrap',
    confidence: 0.97,
    recommendedBin: '🔵 Blue Bin (Dry / Recyclables)',
    disposalInstructions: 'Rinse cans clean. Crush cans to save space in the Blue Recyclable Bin.',
    environmentalImpact: 'Recycling aluminium uses 95% less energy than raw ore extraction.',
    points: 20,
  },
  'E-Waste': {
    category: 'E-Waste',
    material: 'Electronic Device / Circuit Board / Charger',
    confidence: 0.95,
    recommendedBin: '🔴 Red Bin (E-Waste Collection Hub)',
    disposalInstructions: 'Never mix with household trash. Drop off at an authorized E-Waste collection kiosk or DWCC.',
    environmentalImpact: 'Proper e-waste disposal prevents toxic lead, mercury, and cadmium from leaching into soil.',
    points: 25,
  },
  Hazardous: {
    category: 'Hazardous',
    material: 'Battery / Chemical / Paint / Aerosol',
    confidence: 0.98,
    recommendedBin: '🔴 Red Bin (Hazardous Waste)',
    disposalInstructions: 'Never throw in regular trash. Take to a municipal hazardous waste collection drive.',
    environmentalImpact: 'A single battery can contaminate up to 600,000 litres of groundwater if thrown in landfill.',
    points: 25,
  },
  Medical: {
    category: 'Medical',
    material: 'Medical Waste / Expired Medicine / Syringe',
    confidence: 0.96,
    recommendedBin: '⚪ White Bin (Medical Waste)',
    disposalInstructions: 'Return expired medicines to an authorized pharmacy. Place sharps in puncture-proof containers.',
    environmentalImpact: 'Controlled medical disposal eliminates dangerous pathogens.',
    points: 25,
  },
  Textile: {
    category: 'Textile',
    material: 'Clothing / Fabric / Footwear',
    confidence: 0.90,
    recommendedBin: '🟡 Yellow Bin (Textile Collection)',
    disposalInstructions: 'Donate gently used clothing. Worn/torn textiles go to dedicated fabric recycling drop-offs.',
    environmentalImpact: 'Textile reuse and recycling saves thousands of litres of water.',
    points: 15,
  },
};

// ─── Keyword → Category Mapping ──────────────────────────────────────────────
const KEYWORD_MAP = [
  {
    category: 'Plastic',
    keywords: [
      'plastic', 'bag', 'plastic bag', 'shopping bag', 'bottle', 'pet', 'wrapper',
      'polythene', 'polybag', 'sachet', 'pouch', 'container', 'cup', 'straw',
      'packaging', 'foam', 'styrofoam', 'poly', 'tetra', 'jug', 'tub', 'sack'
    ]
  },
  {
    category: 'Biodegradable',
    keywords: [
      'food', 'wet', 'organic', 'vegetable', 'veg', 'fruit', 'banana', 'peel', 'peels',
      'leaf', 'leaves', 'grass', 'compost', 'kitchen', 'rice', 'rotten', 'leftover', 'leftovers',
      'onion', 'potato', 'tomato', 'curry', 'bread', 'apple', 'mango', 'orange', 'meal', 'scrap'
    ]
  },
  {
    category: 'Paper',
    keywords: [
      'paper', 'cardboard', 'newspaper', 'book', 'magazine', 'carton', 'box', 'envelope',
      'tissue', 'napkin', 'document', 'sheet', 'folder', 'pamphlet', 'corrugated'
    ]
  },
  {
    category: 'Glass',
    keywords: ['glass', 'jar', 'mirror', 'vase', 'glassware', 'window', 'bulb']
  },
  {
    category: 'Metal',
    keywords: ['metal', 'can', 'aluminium', 'aluminum', 'tin', 'steel', 'iron', 'wire', 'scrap', 'foil', 'utensil']
  },
  {
    category: 'E-Waste',
    keywords: ['ewaste', 'e_waste', 'electronic', 'electronics', 'phone', 'mobile', 'laptop', 'computer', 'circuit', 'keyboard', 'mouse', 'charger', 'cable', 'tv']
  },
  {
    category: 'Hazardous',
    keywords: ['battery', 'chemical', 'paint', 'hazardous', 'toxic', 'pesticide', 'acid', 'bleach', 'oil', 'solvent']
  },
  {
    category: 'Medical',
    keywords: ['medicine', 'medical', 'tablet', 'capsule', 'syringe', 'needle', 'bandage', 'glove', 'mask']
  },
  {
    category: 'Textile',
    keywords: ['cloth', 'textile', 'fabric', 'shirt', 'pant', 'clothes', 'dress', 'shoes', 'footwear', 'jean', 'sock']
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
  // 1. Direct match if userTag or visualCategory is valid in CLASSIFICATION_DB
  if (userTag && CLASSIFICATION_DB[userTag]) {
    return { category: userTag, method: 'user-selection' };
  }
  if (visualCategory && CLASSIFICATION_DB[visualCategory]) {
    return { category: visualCategory, method: 'ai-vision' };
  }

  // 2. Keyword match on userTag or visualCategory text
  const tagText = `${userTag || ''} ${visualCategory || ''} ${fileName || ''}`.toLowerCase();
  for (const entry of KEYWORD_MAP) {
    if (entry.keywords.some((k) => tagText.includes(k))) {
      return { category: entry.category, method: 'ai-tag-match' };
    }
  }

  // 3. Default fallback
  return { category: 'Plastic', method: 'smart-default' };
}

// ─── Controller Methods ───────────────────────────────────────────────────────
exports.classifyWaste = async (req, res, next) => {
  try {
    const { imageHash, fileName, userTag, visualCategory, visualConfidence, visualStats } = req.body;
    if (!imageHash) return res.status(400).json({ message: 'imageHash is required' });

    const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
    const todayCount = await WasteScan.countDocuments({ userId: req.user._id, createdAt: { $gte: todayStart } });
    if (todayCount >= 100) {
      return res.status(429).json({ message: 'Daily test limit reached (100 scans/day).' });
    }

    // Resolve category
    const { category, method } = resolveCategory(fileName, userTag, visualCategory);
    const result = CLASSIFICATION_DB[category] || CLASSIFICATION_DB.Plastic;

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

    const user = await User.findById(req.user._id);
    user.points += scan.pointsAwarded;
    user.scansCount += 1;
    user.co2SavedKg = parseFloat((user.co2SavedKg + result.points * 0.15).toFixed(2));
    user.level = getLevel(user.points);
    await user.save();

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
