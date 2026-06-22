/**
 * Analyze life factors data for Mother and Father
 * @param {array} data - Array of objects with life factors
 * @returns {object} Analyzed data with totals, highs, lows, and comparisons
 */
function analyzeData(data) {
  try {
    if (!data || data.length === 0) {
      return { success: false, error: 'No data provided' };
    }

    // Extract Mother and Father columns (adjust based on actual column names)
    const motherData = extractFactorData(data, 'mother');
    const fatherData = extractFactorData(data, 'father');

    if (motherData.error || fatherData.error) {
      return { success: false, error: 'Could not extract mother/father data' };
    }

    // Calculate totals
    const motherTotal = Object.values(motherData.factors).reduce((sum, val) => sum + val, 0);
    const fatherTotal = Object.values(fatherData.factors).reduce((sum, val) => sum + val, 0);

    // Check if totals sum to approximately 100
    const motherValid = Math.abs(motherTotal - 100) < 1;
    const fatherValid = Math.abs(fatherTotal - 100) < 1;

    // Find highest and lowest factors
    const motherHighest = getHighestFactor(motherData.factors);
    const motherLowest = getLowestFactor(motherData.factors);
    const fatherHighest = getHighestFactor(fatherData.factors);
    const fatherLowest = getLowestFactor(fatherData.factors);

    // Compare factors
    const comparison = compareFactors(motherData.factors, fatherData.factors);

    // Generate insights
    const insights = generateInsights(
      motherData.factors,
      fatherData.factors,
      motherTotal,
      fatherTotal,
      comparison
    );

    return {
      success: true,
      validation: {
        motherValid,
        fatherValid,
        motherTotal: Math.round(motherTotal * 100) / 100,
        fatherTotal: Math.round(fatherTotal * 100) / 100
      },
      motherData: {
        factors: motherData.factors,
        total: Math.round(motherTotal * 100) / 100,
        highest: motherHighest,
        lowest: motherLowest
      },
      fatherData: {
        factors: fatherData.factors,
        total: Math.round(fatherTotal * 100) / 100,
        highest: fatherHighest,
        lowest: fatherLowest
      },
      comparison,
      insights
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Extract factor data for mother or father
 */
function extractFactorData(data, parent) {
  const factors = {};
  const lifeFactors = [
    'career', 'family', 'health', 'spirituality', 'finances', 'personal_growth', 'relationships'
  ];

  for (const factor of lifeFactors) {
    const key = `${parent}_${factor}`;
    let value = 0;

    // Try to find the value in data
    for (const row of data) {
      if (row[key] !== undefined) {
        value = parseFloat(row[key]) || 0;
        break;
      }
    }

    factors[factor] = value;
  }

  return { factors };
}

/**
 * Get highest factor and value
 */
function getHighestFactor(factors) {
  let highest = { factor: null, value: 0 };
  for (const [factor, value] of Object.entries(factors)) {
    if (value > highest.value) {
      highest = { factor, value };
    }
  }
  return highest;
}

/**
 * Get lowest factor and value
 */
function getLowestFactor(factors) {
  let lowest = { factor: null, value: Infinity };
  for (const [factor, value] of Object.entries(factors)) {
    if (value < lowest.value && value > 0) {
      lowest = { factor, value };
    }
  }
  return lowest.factor ? lowest : { factor: null, value: 0 };
}

/**
 * Compare factors between mother and father
 */
function compareFactors(motherFactors, fatherFactors) {
  const comparison = {};

  for (const factor of Object.keys(motherFactors)) {
    const motherVal = motherFactors[factor] || 0;
    const fatherVal = fatherFactors[factor] || 0;
    const difference = motherVal - fatherVal;

    comparison[factor] = {
      mother: Math.round(motherVal * 100) / 100,
      father: Math.round(fatherVal * 100) / 100,
      difference: Math.round(difference * 100) / 100,
      percentageDifference: fatherVal > 0 ? Math.round((difference / fatherVal) * 100) : 0,
      winner: motherVal > fatherVal ? 'mother' : fatherVal > motherVal ? 'father' : 'tie'
    };
  }

  return comparison;
}

/**
 * Generate insights and recommendations
 */
function generateInsights(motherFactors, fatherFactors, motherTotal, fatherTotal, comparison) {
  const insights = [];
  const recommendations = [];

  // Overall insights
  if (motherTotal > fatherTotal) {
    insights.push(`Mother has a higher overall total (${motherTotal}) compared to Father (${fatherTotal}).`);
  } else if (fatherTotal > motherTotal) {
    insights.push(`Father has a higher overall total (${fatherTotal}) compared to Mother (${motherTotal}).`);
  } else {
    insights.push('Both have equal overall totals.');
  }

  // Factor comparisons
  let motherLeads = 0;
  let fatherLeads = 0;

  for (const [factor, data] of Object.entries(comparison)) {
    if (data.winner === 'mother') {
      motherLeads++;
      insights.push(`Mother leads in ${factor}: ${data.mother} vs ${data.father}`);
    } else if (data.winner === 'father') {
      fatherLeads++;
      insights.push(`Father leads in ${factor}: ${data.father} vs ${data.mother}`);
    }
  }

  // Recommendations
  if (motherLeads > fatherLeads) {
    recommendations.push('Mother demonstrates stronger leadership across most life factors.');
  } else if (fatherLeads > motherLeads) {
    recommendations.push('Father demonstrates stronger presence across most life factors.');
  }

  recommendations.push('Focus on areas with lower scores to achieve better balance.');
  recommendations.push('Maintain strengths in high-scoring factors.');
  recommendations.push('Consider collaborative approaches in factors where there are significant differences.');

  return {
    insights,
    recommendations,
    motherLeads,
    fatherLeads
  };
}

module.exports = {
  analyzeData,
  extractFactorData,
  getHighestFactor,
  getLowestFactor,
  compareFactors,
  generateInsights
};
