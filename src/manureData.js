import { translations } from './translations';

export const LAND_DATABASE = {
  loam: {
    id: 'loam',
    values: { n: 2, p: 2, k: 2, ca: 2, mg: 2, s: 2, fe: 2, zn: 2, mn: 2, cu: 2, b: 2 },
    icon: 'Map'
  },
  sandy: {
    id: 'sandy',
    values: { n: 1, p: 1, k: 1, ca: 1, mg: 1, s: 1, fe: 1, zn: 1, mn: 1, cu: 1, b: 1 },
    icon: 'Sun'
  },
  clay: {
    id: 'clay',
    values: { n: 2, p: 1, k: 3, ca: 3, mg: 2, s: 1, fe: 3, zn: 2, mn: 3, cu: 2, b: 1 },
    icon: 'Layers'
  }
};

export const MANURE_DATABASE = {
  cow: {
    id: 'cow',
    values: { n: 1, p: 2, k: 2, ca: 2, mg: 1, s: 1, fe: 2, zn: 1, mn: 2, cu: 1, b: 1 },
    icon: 'Beef'
  },
  poultry: {
    id: 'poultry',
    values: { n: 3, p: 3, k: 2, ca: 4, mg: 1, s: 2, fe: 3, zn: 3, mn: 2, cu: 2, b: 2 },
    icon: 'Bird'
  },
  pig: {
    id: 'pig',
    values: { n: 2, p: 3, k: 1, ca: 1, mg: 2, s: 1, fe: 2, zn: 3, mn: 1, cu: 2, b: 1 },
    icon: 'PiggyBank'
  },
  goat: {
    id: 'goat',
    values: { n: 3, p: 2, k: 3, ca: 3, mg: 2, s: 2, fe: 2, zn: 2, mn: 3, cu: 1, b: 2 },
    icon: 'Bug'
  },
  compost: {
    id: 'compost',
    values: { n: 2, p: 2, k: 2, ca: 2, mg: 2, s: 2, fe: 3, zn: 2, mn: 2, cu: 2, b: 3 },
    icon: 'Leaf'
  }
};

export const CROP_REQUIREMENTS = {
  maize: {
    id: 'maize',
    values: { n: 3, p: 2, k: 2, ca: 2, mg: 2, s: 2, fe: 2, zn: 3, mn: 2, cu: 1, b: 1 },
    icon: 'Wheat'
  },
  potatoes: {
    id: 'potatoes',
    values: { n: 2, p: 2, k: 3, ca: 1, mg: 2, s: 1, fe: 2, zn: 2, mn: 3, cu: 1, b: 2 },
    icon: 'Sprout'
  },
  tomatoes: {
    id: 'tomatoes',
    values: { n: 2, p: 3, k: 3, ca: 3, mg: 2, s: 2, fe: 3, zn: 3, mn: 2, cu: 2, b: 2 },
    icon: 'Apple'
  },
  beans: {
    id: 'beans',
    values: { n: 1, p: 2, k: 2, ca: 2, mg: 1, s: 2, fe: 2, zn: 2, mn: 2, cu: 2, b: 3 },
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
  const avgManureFe = manures.reduce((sum, m) => sum + m.values.fe, 0) / manures.length;
  const avgManureZn = manures.reduce((sum, m) => sum + m.values.zn, 0) / manures.length;
  const avgManureMn = manures.reduce((sum, m) => sum + m.values.mn, 0) / manures.length;
  const avgManureCu = manures.reduce((sum, m) => sum + m.values.cu, 0) / manures.length;
  const avgManureB = manures.reduce((sum, m) => sum + m.values.b, 0) / manures.length;

  // Determine standard supplement based on missing nutrients
  const totalN = land.values.n + avgManureN;
  const totalP = land.values.p + avgManureP;
  const totalK = land.values.k + avgManureK;
  const totalCa = land.values.ca + avgManureCa;
  const totalMg = land.values.mg + avgManureMg;
  const totalS = land.values.s + avgManureS;
  const totalFe = land.values.fe + avgManureFe;
  const totalZn = land.values.zn + avgManureZn;
  const totalMn = land.values.mn + avgManureMn;
  const totalCu = land.values.cu + avgManureCu;
  const totalB = land.values.b + avgManureB;

  const targetN = crop.values.n * 1.5; 
  const targetP = crop.values.p * 1.5;
  const targetK = crop.values.k * 1.5;
  const targetCa = crop.values.ca * 1.5;
  const targetMg = crop.values.mg * 1.5;
  const targetS = crop.values.s * 1.5;
  const targetFe = crop.values.fe * 1.5;
  const targetZn = crop.values.zn * 1.5;
  const targetMn = crop.values.mn * 1.5;
  const targetCu = crop.values.cu * 1.5;
  const targetB = crop.values.b * 1.5;

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
      s: totalS,
      fe: totalFe,
      zn: totalZn,
      mn: totalMn,
      cu: totalCu,
      b: totalB
    }, {
      n: targetN,
      p: targetP,
      k: targetK,
      ca: targetCa,
      mg: targetMg,
      s: targetS,
      fe: targetFe,
      zn: targetZn,
      mn: targetMn,
      cu: targetCu,
      b: targetB
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
  const feScore = Math.min(combinedVals.fe / targetVals.fe, 1);
  const znScore = Math.min(combinedVals.zn / targetVals.zn, 1);
  const mnScore = Math.min(combinedVals.mn / targetVals.mn, 1);
  const cuScore = Math.min(combinedVals.cu / targetVals.cu, 1);
  const bScore = Math.min(combinedVals.b / targetVals.b, 1);
  return {
    n: nScore * 100,
    p: pScore * 100,
    k: kScore * 100,
    ca: caScore * 100,
    mg: mgScore * 100,
    s: sScore * 100,
    fe: feScore * 100,
    zn: znScore * 100,
    mn: mnScore * 100,
    cu: cuScore * 100,
    b: bScore * 100
  };
}


