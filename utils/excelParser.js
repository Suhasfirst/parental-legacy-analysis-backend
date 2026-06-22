const XLSX = require('xlsx');
const fs = require('fs');

/**
 * Read and parse Excel file
 * @param {string} filePath - Path to the Excel file
 * @returns {object} Parsed data with metadata
 */
function readExcelFile(filePath) {
  try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);
    
    return {
      success: true,
      data: data,
      sheetName: sheetName,
      rowCount: data.length,
      columns: data.length > 0 ? Object.keys(data[0]) : []
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Clean and validate data from Excel
 * @param {array} data - Raw data from Excel
 * @returns {object} Cleaned and validated data
 */
function cleanAndValidateData(data) {
  try {
    const cleaned = data.map(row => {
      return Object.keys(row).reduce((acc, key) => {
        const value = row[key];
        const numericValue = parseFloat(value);

        if (value === null || value === undefined || value === '') {
          acc[key] = 0;
        } else if (!isNaN(numericValue) && typeof value !== 'object') {
          acc[key] = numericValue;
        } else {
          acc[key] = value;
        }

        return acc;
      }, {});
    });

    return {
      success: true,
      data: cleaned,
      rowCount: cleaned.length
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

module.exports = {
  readExcelFile,
  cleanAndValidateData
};
