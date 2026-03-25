import { translations } from './translations';

export const LAND_DATABASE = {
  loam: {
    id: 'loam',
    values: { n: 2, p: 2, k: 2, ca: 2, mg: 2, s: 2 },
    icon: 'Map'
  },
  sandy: {
    id: 'sandy',
    values: { n: 1, p: 1, k: 1, ca: 1, mg: 1, s: 1 },
    icon: 'Sun'
  },
  clay: {
    id: 'clay',
    values: { n: 2, p: 1, k: 3, ca: 3, mg: 2, s: 1 },
    icon: 'Layers'
  }
};

export const MANURE_DATABASE = {
  cow: {
    id: 'cow',
    values: { n: 1, p: 2, k: 2, ca: 2, mg: 1, s: 1 },
    icon: 'Beef'
  },
  poultry: {
    id: 'poultry',
    values: { n: 3, p: 3, k: 2, ca: 4, mg: 1, s: 2 },
    icon: 'Bird'
  },
  pig: {
    id: 'pig',
    values: { n: 2, p: 3, k: 1, ca: 1, mg: 2, s: 1 },
    icon: 'PiggyBank'
  },
  goat: {
    id: 'goat',
    values: { n: 3, p: 2, k: 3, ca: 3, mg: 2, s: 2 },
    icon: 'Bug'
  },
  compost: {
    id: 'compost',
    values: { n: 2, p: 2, k: 2, ca: 2, mg: 2, s: 2 },
    icon: 'Leaf'
  }
};

export const CROP_REQUIREMENTS = {
  maize: {
    id: 'maize',
    values: { n: 3, p: 2, k: 2, ca: 2, mg: 2, s: 2 },
    icon: 'Wheat'
  },
  potatoes: {
    id: 'potatoes',
    values: { n: 2, p: 2, k: 3, ca: 1, mg: 2, s: 1 },
    icon: 'Sprout'
  },
  tomatoes: {
    id: 'tomatoes',
    values: { n: 2, p: 3, k: 3, ca: 3, mg: 2, s: 2 },
    icon: 'Apple'
  },
  beans: {
    id: 'beans',
    values: { n: 1, p: 2, k: 2, ca: 2, mg: 1, s: 2 },
    icon: 'Cherry'
  }
};

export const determineOptimalMix = (landId, manureIds, cropId, lang = 'en') => {
  const t = translations[lang];
  const land = LAND_DATABASE[landId];
  const manures = manureIds.map(id => MANURE_DATABASE[id]).filter(Boolean);
  const crop = CROP_REQUIREMENTS[cropId];
  
  if (!land || manures.length === 0 || !crop) return null;

  let recommendationKey = "";
  let supplementaryManureId = null;
  let mixRatio = { base: 100, supplementary: 0 };
  let yieldIncrease = "30-50%";

  const landName = t.landTypes[landId];
  const baseManureNames = manureIds.map(id => t.manureTypes[id]).join(' + ');
  const cropName = t.cropTypes[cropId];

  // Average the nutrients of the selected manures
  const avgManureN = manures.reduce((sum, m) => sum + m.values.n, 0) / manures.length;
  const avgManureP = manures.reduce((sum, m) => sum + m.values.p, 0) / manures.length;
  const avgManureK = manures.reduce((sum, m) => sum + m.values.k, 0) / manures.length;
  const avgManureCa = manures.reduce((sum, m) => sum + m.values.ca, 0) / manures.length;
  const avgManureMg = manures.reduce((sum, m) => sum + m.values.mg, 0) / manures.length;
  const avgManureS = manures.reduce((sum, m) => sum + m.values.s, 0) / manures.length;

  // Determine standard supplement based on missing nutrients
  const totalN = land.values.n + avgManureN;
  const totalP = land.values.p + avgManureP;
  const totalK = land.values.k + avgManureK;
  const totalCa = land.values.ca + avgManureCa;
  const totalMg = land.values.mg + avgManureMg;
  const totalS = land.values.s + avgManureS;

  const targetN = crop.values.n * 1.5; 
  const targetP = crop.values.p * 1.5;
  const targetK = crop.values.k * 1.5;
  const targetCa = crop.values.ca * 1.5;
  const targetMg = crop.values.mg * 1.5;
  const targetS = crop.values.s * 1.5;

  if (totalN < targetN) {
    supplementaryManureId = 'poultry';
    recommendationKey = 'nitrogen';
    mixRatio = { base: 60, supplementary: 40 };
  } else if (totalK < targetK) {
    supplementaryManureId = 'goat';
    recommendationKey = 'potassium';
    mixRatio = { base: 70, supplementary: 30 };
  } else if (totalP < targetP) {
    supplementaryManureId = 'pig';
    recommendationKey = 'phosphorus';
    mixRatio = { base: 65, supplementary: 35 };
  } else {
    supplementaryManureId = 'compost';
    recommendationKey = 'perfect';
    mixRatio = { base: 85, supplementary: 15 };
    yieldIncrease = "45-60%";
  }

  const rationale = t.recommendations[recommendationKey]
    .replace('{land}', landName)
    .replace('{manure}', baseManureNames)
    .replace('{crop}', cropName);

  return {
    baseManure: baseManureNames,
    supplementaryManure: supplementaryManureId ? t.manureTypes[supplementaryManureId] : t.none,
    rationale: rationale,
    mixRatio,
    yieldIncrease,
    nutrientGap: calculateGap({
      n: totalN,
      p: totalP,
      k: totalK,
      ca: totalCa,
      mg: totalMg,
      s: totalS
    }, {
      n: targetN,
      p: targetP,
      k: targetK,
      ca: targetCa,
      mg: targetMg,
      s: targetS
    })
  };
};

function calculateGap(combinedVals, targetVals) {
  const nScore = Math.min(combinedVals.n / targetVals.n, 1);
  const pScore = Math.min(combinedVals.p / targetVals.p, 1);
  const kScore = Math.min(combinedVals.k / targetVals.k, 1);
  const caScore = Math.min(combinedVals.ca / targetVals.ca, 1);
  const mgScore = Math.min(combinedVals.mg / targetVals.mg, 1);
  const sScore = Math.min(combinedVals.s / targetVals.s, 1);
  return {
    n: nScore * 100,
    p: pScore * 100,
    k: kScore * 100,
    ca: caScore * 100,
    mg: mgScore * 100,
    s: sScore * 100
  };
}


