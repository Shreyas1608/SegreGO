/**
 * Analyzes image pixel data from an HTML5 Canvas to detect waste category.
 * Converts RGB pixels to HSV to classify organic, plastic, paper, metal, e-waste, etc.
 */
export function analyzeImagePixels(imageElement) {
  try {
    const canvas = document.createElement('canvas');
    const size = 64; // 64x64 = 4096 samples
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.drawImage(imageElement, 0, 0, size, size);
    const imgData = ctx.getImageData(0, 0, size, size);
    const data = imgData.data;

    let organicCount = 0;      // food, vegetables, fruit, leaves, soil, curries, peels
    let plasticCount = 0;      // clear bottles, colored plastics, synthetic wrappers
    let paperCount = 0;        // cardboard tan, white paper, newsprint
    let metalCount = 0;        // silver, chrome, metallic gray reflectance
    let ewasteCount = 0;       // PCB green, dark chips, matte black, wires
    let glassCount = 0;        // reflective glassy, high-contrast cyan/transparent

    let totalR = 0, totalG = 0, totalB = 0;
    const totalPixels = size * size;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      totalR += r;
      totalG += g;
      totalB += b;

      // RGB to HSV conversion
      const max = Math.max(r, g, b) / 255;
      const min = Math.min(r, g, b) / 255;
      const d = max - min;
      const s = max === 0 ? 0 : d / max;
      const v = max;
      let h = 0;

      if (d !== 0) {
        if (max === r / 255) {
          h = ((g - b) / 255 / d + (g < b ? 6 : 0)) * 60;
        } else if (max === g / 255) {
          h = ((b - r) / 255 / d + 2) * 60;
        } else {
          h = ((r - g) / 255 / d + 4) * 60;
        }
      }

      // 1. Organic / Wet Waste:
      // - Greens (hue 65-165, moderate to high saturation) -> leaves, veg
      // - Yellows / Oranges (hue 25-65, s > 0.3) -> bananas, citrus, peels, curries
      // - Warm Browns (hue 15-45, s 0.25-0.75, v 0.2-0.75) -> food scraps, cooked food, coffee/tea
      // - Food Reds (hue > 345 or < 15, s > 0.35, v > 0.25) -> tomatoes, apples, meat scraps
      const isGreen = h >= 65 && h <= 165 && s > 0.25;
      const isYellowOrange = h >= 25 && h < 65 && s > 0.3;
      const isWarmBrown = h >= 15 && h < 45 && s >= 0.25 && s <= 0.8 && v >= 0.15 && v <= 0.75;
      const isFoodRed = (h > 345 || h < 15) && s > 0.35 && v > 0.25;

      if (isGreen || isYellowOrange || isWarmBrown || isFoodRed) {
        organicCount++;
      }

      // 2. Paper / Cardboard:
      // - Kraft tan/beige: h 28-48, low-med s 0.15-0.45, v 0.45-0.85
      // - White paper: s < 0.1, v > 0.85
      const isKraft = h >= 28 && h <= 48 && s >= 0.15 && s <= 0.45 && v >= 0.45 && v <= 0.85;
      const isWhitePaper = s < 0.12 && v > 0.82;
      if (isKraft || isWhitePaper) {
        paperCount++;
      }

      // 3. Plastic:
      // - Cyan / Blue plastic: h 175-245, s > 0.35
      // - High gloss translucent / bright white reflections with plastic hues
      const isBluePlastic = h >= 175 && h <= 245 && s > 0.35;
      const isTranslucentPlastic = s < 0.25 && v > 0.7 && !isWhitePaper;
      if (isBluePlastic || isTranslucentPlastic) {
        plasticCount++;
      }

      // 4. Metal:
      // - Neutral silvery grey / high specular: s < 0.15, v 0.3 - 0.8
      if (s < 0.15 && v >= 0.3 && v <= 0.8) {
        metalCount++;
      }

      // 5. E-waste:
      // - Dark PCB green (h 80-140, v < 0.4, s > 0.3) OR matte dark circuit grey/black
      if ((h >= 80 && h <= 140 && v < 0.4 && s > 0.3) || (v < 0.25 && s < 0.3)) {
        ewasteCount++;
      }
    }

    const avgR = Math.round(totalR / totalPixels);
    const avgG = Math.round(totalG / totalPixels);
    const avgB = Math.round(totalB / totalPixels);

    const scores = {
      Biodegradable: organicCount / totalPixels,
      Paper: paperCount / totalPixels,
      Plastic: plasticCount / totalPixels,
      Metal: metalCount / totalPixels,
      'E-Waste': ewasteCount / totalPixels,
    };

    // Find highest scoring category
    let bestCategory = 'Biodegradable';
    let maxScore = scores.Biodegradable;

    for (const [cat, score] of Object.entries(scores)) {
      if (score > maxScore) {
        maxScore = score;
        bestCategory = cat;
      }
    }

    // Organic threshold: food/vegetables usually have strong organic signals
    // Even 20%+ organic tones in a kitchen photo indicates wet waste
    if (scores.Biodegradable >= 0.18) {
      bestCategory = 'Biodegradable';
      maxScore = Math.max(maxScore, scores.Biodegradable);
    }

    const confidence = Math.min(0.98, Math.max(0.85, 0.75 + maxScore * 0.3));

    return {
      category: bestCategory,
      confidence: parseFloat(confidence.toFixed(2)),
      scores,
      avgColor: `rgb(${avgR},${avgG},${avgB})`,
      organicPercent: Math.round((organicCount / totalPixels) * 100),
      plasticPercent: Math.round((plasticCount / totalPixels) * 100),
      paperPercent: Math.round((paperCount / totalPixels) * 100),
    };
  } catch (err) {
    console.warn('Canvas image analysis error:', err);
    return null;
  }
}
