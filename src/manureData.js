export const LAND_DATABASE = {
  loam: {
    id: 'loam',
    name: 'Loam Soil',
    values: { n: 2, p: 2, k: 2 },
    icon: 'Map'
  },
  sandy: {
    id: 'sandy',
    name: 'Sandy Soil',
    values: { n: 1, p: 1, k: 1 },
    icon: 'Sun'
  },
  clay: {
    id: 'clay',
    name: 'Clay Soil',
    values: { n: 2, p: 1, k: 3 },
    icon: 'Layers'
  }
};

export const MANURE_DATABASE = {
  cow: {
    id: 'cow',
    name: 'Cow',
    n: 'Low',
    p: 'Medium',
    k: 'Medium',
    values: { n: 1, p: 2, k: 2 },
    icon: 'Beef'
  },
  poultry: {
    id: 'poultry',
    name: 'Poultry',
    n: 'High',
    p: 'High',
    k: 'Medium',
    values: { n: 3, p: 3, k: 2 },
    icon: 'Bird'
  },
  pig: {
    id: 'pig',
    name: 'Pig',
    n: 'Medium',
    p: 'High',
    k: 'Low',
    values: { n: 2, p: 3, k: 1 },
    icon: 'PiggyBank'
  },
  goat: {
    id: 'goat',
    name: 'Goat',
    n: 'High',
    p: 'Medium',
    k: 'High',
    values: { n: 3, p: 2, k: 3 },
    icon: 'Bug'
  },
  compost: {
    id: 'compost',
    name: 'Compost',
    n: 'Medium',
    p: 'Medium',
    k: 'Medium',
    values: { n: 2, p: 2, k: 2 },
    icon: 'Leaf'
  }
};

export const CROP_REQUIREMENTS = {
  maize: {
    id: 'maize',
    name: 'Maize',
    n: 'High',
    p: 'Medium',
    k: 'Medium',
    values: { n: 3, p: 2, k: 2 },
    description: 'Requires high nitrogen for vegetative growth.',
    icon: 'Wheat'
  },
  potatoes: {
    id: 'potatoes',
    name: 'Potatoes',
    n: 'Medium',
    p: 'Medium',
    k: 'High',
    values: { n: 2, p: 2, k: 3 },
    description: 'Requires high potassium for tuber development.',
    icon: 'Sprout'
  },
  tomatoes: {
    id: 'tomatoes',
    name: 'Tomatoes',
    n: 'Medium',
    p: 'High',
    k: 'High',
    values: { n: 2, p: 3, k: 3 },
    description: 'Needs phosphorus and potassium for fruit development.',
    icon: 'Apple'
  },
  beans: {
    id: 'beans',
    name: 'Beans',
    n: 'Low',
    p: 'Medium',
    k: 'Medium',
    values: { n: 1, p: 2, k: 2 },
    description: 'Legumes fix their own nitrogen; require P and K.',
    icon: 'Cherry'
  }
};

export const determineOptimalMix = (landId, manureIds, cropId) => {
  const land = LAND_DATABASE[landId];
  const manures = manureIds.map(id => MANURE_DATABASE[id]).filter(Boolean);
  const crop = CROP_REQUIREMENTS[cropId];
  
  if (!land || manures.length === 0 || !crop) return null;

  let recommendation = "";
  let supplementaryManureId = null;
  let mixRatio = { base: 100, supplementary: 0 };
  let yieldIncrease = "30-50%";

  const baseManureNames = manures.map(m => m.name).join(' + ');

  // Average the nutrients of the selected manures
  const avgManureN = manures.reduce((sum, m) => sum + m.values.n, 0) / manures.length;
  const avgManureP = manures.reduce((sum, m) => sum + m.values.p, 0) / manures.length;
  const avgManureK = manures.reduce((sum, m) => sum + m.values.k, 0) / manures.length;

  // Determine standard supplement based on missing nutrients
  const totalN = land.values.n + avgManureN;
  const totalP = land.values.p + avgManureP;
  const totalK = land.values.k + avgManureK;

  const targetN = crop.values.n * 1.5; 
  const targetP = crop.values.p * 1.5;
  const targetK = crop.values.k * 1.5;

  if (totalN < targetN) {
    supplementaryManureId = 'poultry'; // High N
    recommendation = `The combination of ${land.name} and base sources (${baseManureNames}) lacks sufficient Nitrogen for ${crop.name}. Supplementing with Nitrogen-rich Poultry manure is recommended.`;
    mixRatio = { base: 60, supplementary: 40 };
  } else if (totalK < targetK) {
    supplementaryManureId = 'goat'; // High K
    recommendation = `The selected ${land.name} and base sources (${baseManureNames}) are deficient in Potassium for ${crop.name}. Adding Goat manure will provide the necessary Potassium boost.`;
    mixRatio = { base: 70, supplementary: 30 };
  } else if (totalP < targetP) {
     supplementaryManureId = 'pig'; // High P
     recommendation = `${crop.name} requires more Phosphorus than what ${land.name} and base sources (${baseManureNames}) provide. A Pig manure supplement will bridge the Phosphorus gap.`;
     mixRatio = { base: 65, supplementary: 35 };
  } else {
    recommendation = `Excellent match! ${land.name} and base sources (${baseManureNames}) provide a well-rounded nutrient profile for ${crop.name}. A small Compost addition will ensure healthy soil microbiota.`;
    supplementaryManureId = 'compost';
    mixRatio = { base: 85, supplementary: 15 };
    yieldIncrease = "45-60%";
  }

  return {
    baseManure: baseManureNames,
    supplementaryManure: supplementaryManureId ? MANURE_DATABASE[supplementaryManureId].name : "None",
    rationale: recommendation,
    mixRatio,
    yieldIncrease,
    nutrientGap: calculateGap({
      n: totalN,
      p: totalP,
      k: totalK
    }, {
      n: targetN,
      p: targetP,
      k: targetK
    })
  };
};

function calculateGap(combinedVals, targetVals) {
  const nScore = Math.min(combinedVals.n / targetVals.n, 1);
  const pScore = Math.min(combinedVals.p / targetVals.p, 1);
  const kScore = Math.min(combinedVals.k / targetVals.k, 1);
  return {
    n: nScore * 100,
    p: pScore * 100,
    k: kScore * 100
  };
}

