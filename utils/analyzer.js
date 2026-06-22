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

    // Skip header rows - check if first row looks like headers
    let startRow = 0;
    const firstRow = data[0];
    if (firstRow) {
      const values = Object.values(firstRow);
      const hasOnlyText = values.every(v => isNaN(v) && v !== null && v !== undefined);
      if (hasOnlyText) {
        startRow = 1;
      }
    }

    // Use only data rows (skip headers)
    const dataRows = data.slice(startRow);
    if (dataRows.length === 0) {
      return { success: false, error: 'No data rows found after headers' };
    }

    const motherData = extractFactorData(data, 'mother');
    const fatherData = extractFactorData(data, 'father');

    if (!motherData || !fatherData || !motherData.factors || !fatherData.factors) {
      return { success: false, error: 'Could not extract mother/father data' };
    }

    const motherTotal = Object.values(motherData.factors).reduce((sum, val) => sum + val, 0);
    const fatherTotal = Object.values(fatherData.factors).reduce((sum, val) => sum + val, 0);
    const grandTotal = Math.round((motherTotal + fatherTotal) * 1000) / 1000;

    let motherValid = true;
    let fatherValid = true;
    let grandValid = Math.abs(grandTotal - 100) < 1;

    if (motherData.mode === 'fixed-format') {
      motherValid = Math.abs(motherTotal - 100) < 1;
      fatherValid = Math.abs(fatherTotal - 100) < 1;
    }

    const motherHighest = getHighestFactor(motherData.factors);
    const motherLowest = getLowestFactor(motherData.factors);
    const fatherHighest = getHighestFactor(fatherData.factors);
    const fatherLowest = getLowestFactor(fatherData.factors);

    const comparison = compareFactors(motherData.factors, fatherData.factors);

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
        grandValid,
        motherTotal: Math.round(motherTotal * 1000) / 1000,
        fatherTotal: Math.round(fatherTotal * 1000) / 1000,
        grandTotal
      },
      motherData: {
        factors: motherData.factors,
        total: Math.round(motherTotal * 1000) / 1000,
        highest: motherHighest,
        lowest: motherLowest
      },
      fatherData: {
        factors: fatherData.factors,
        total: Math.round(fatherTotal * 1000) / 1000,
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
  
  // Step 1: Find the indices of mother and father columns
  if (data.length === 0) return { factors: {}, mode: 'empty' };

  const headerRow = data[0];
  const columnKeys = Object.keys(headerRow);
  
  let motherColIndex = -1;
  let fatherColIndex = -1;
  let nameColIndex = -1;
  
  // Find mother and father columns (case-insensitive, handles __EMPTY names)
  for (let i = 0; i < columnKeys.length; i++) {
    const key = columnKeys[i];
    const value = String(headerRow[key]).toLowerCase().trim();
    
    if (value.includes('mother') || value === 'mother') {
      motherColIndex = i;
    }
    if (value.includes('father') || value === 'father') {
      fatherColIndex = i;
    }
    // First column with text (not __EMPTY) is likely the factor name
    if (nameColIndex === -1 && !key.includes('__EMPTY') && !value.includes('mother') && !value.includes('father') && !value.includes('total') && !value.includes('minimum') && !value.includes('maximum')) {
      nameColIndex = i;
    }
  }

  // Step 2: If we found mother/father columns, use the row-based format
  if (motherColIndex >= 0 && fatherColIndex >= 0) {
    // Skip header row, process data rows
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      
      // Get factor name from the name column or first column
      let factorName = null;
      if (nameColIndex >= 0) {
        factorName = row[columnKeys[nameColIndex]];
      } else {
        factorName = row[columnKeys[0]];
      }
      
      // Skip if no factor name
      if (!factorName || factorName === '') continue;
      
      // Get mother and father values
      const motherValue = parseFloat(row[columnKeys[motherColIndex]]) || 0;
      const fatherValue = parseFloat(row[columnKeys[fatherColIndex]]) || 0;
      
      // Only add if at least one has a value
      if (motherValue > 0 || fatherValue > 0) {
        if (parent.toLowerCase() === 'mother') {
          factors[String(factorName).trim()] = motherValue;
        } else if (parent.toLowerCase() === 'father') {
          factors[String(factorName).trim()] = fatherValue;
        }
      }
    }
    
    if (Object.keys(factors).length > 0) {
      return { factors, mode: 'row-based-flexible' };
    }
  }

  // Step 3: Fall back to detecting by row data (old method)
  const rowBased = data.some(row => {
    if (typeof row !== 'object' || row === null) return false;
    const keys = Object.keys(row).map(k => k.toLowerCase());
    const hasMother = keys.includes('mother') || keys.some(k => k.endsWith('_mother'));
    const hasFather = keys.includes('father') || keys.some(k => k.endsWith('_father'));
    return hasMother && hasFather;
  });

  if (rowBased) {
    for (const row of data) {
      const label = row.name || row.factor || row.category || row.label || `factor_${Object.keys(factors).length + 1}`;
      let value = 0;
      for (const [key, val] of Object.entries(row)) {
        const keyLower = key.toLowerCase();
        if (keyLower === parent.toLowerCase() || keyLower === `${parent.toLowerCase()}_value`) {
          value = parseFloat(val) || 0;
          break;
        }
      }
      factors[label] = value;
    }
    return { factors, mode: 'row-based' };
  }

  // Step 4: Try fixed format (mother_career, father_family, etc.)
  const lifeFactors = [
    'career', 'family', 'health', 'spirituality', 'finances', 'personal_growth', 'relationships'
  ];

  for (const factor of lifeFactors) {
    const key = `${parent}_${factor}`;
    let value = 0;

    for (const row of data) {
      if (row[key] !== undefined) {
        value = parseFloat(row[key]) || 0;
        break;
      }
    }

    factors[factor] = value;
  }

  return { factors, mode: 'fixed-format' };
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

  const formatNumber = value => Math.round(value * 1000) / 1000;

  // Overall insights
  if (motherTotal > fatherTotal) {
    insights.push(`Mother has a higher overall total (${formatNumber(motherTotal)}) compared to Father (${formatNumber(fatherTotal)}).`);
  } else if (fatherTotal > motherTotal) {
    insights.push(`Father has a higher overall total (${formatNumber(fatherTotal)}) compared to Mother (${formatNumber(motherTotal)}).`);
  } else {
    insights.push('Both have equal overall totals.');
  }

  // Factor comparisons
  let motherLeads = 0;
  let fatherLeads = 0;

  for (const [factor, data] of Object.entries(comparison)) {
    if (data.winner === 'mother') {
      motherLeads++;
      insights.push(`Mother leads in ${factor}: ${formatNumber(data.mother)} vs ${formatNumber(data.father)}`);
    } else if (data.winner === 'father') {
      fatherLeads++;
      insights.push(`Father leads in ${factor}: ${formatNumber(data.father)} vs ${formatNumber(data.mother)}`);
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
