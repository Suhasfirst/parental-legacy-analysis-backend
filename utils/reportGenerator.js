const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

/**
 * Generate complete PDF report
 */
async function generatePDFReport(analysisData, charts) {
  return new Promise((resolve, reject) => {
    try {
      const timestamp = new Date().toISOString().split('T')[0];
      const reportPath = path.join(__dirname, '../reports', `report_${timestamp}_${Date.now()}.pdf`);

      const doc = new PDFDocument({ margin: 50 });
      const stream = fs.createWriteStream(reportPath);

      doc.pipe(stream);

      // Title
      doc.fontSize(24).font('Helvetica-Bold').text('Life Factors Analysis Report', { align: 'center' });
      doc.fontSize(10).font('Helvetica').text(`Generated: ${new Date().toLocaleString()}`, { align: 'center' });
      doc.moveDown(1);

      // Executive Summary
      doc.fontSize(14).font('Helvetica-Bold').text('Executive Summary');
      doc.fontSize(10).font('Helvetica');
      doc.text(`Mother's Total Score: ${analysisData.motherData.total}`);
      doc.text(`Father's Total Score: ${analysisData.fatherData.total}`);
      doc.text(`Mother's Data Valid: ${analysisData.validation.motherValid ? 'Yes' : 'No'}`);
      doc.text(`Father's Data Valid: ${analysisData.validation.fatherValid ? 'Yes' : 'No'}`);
      doc.moveDown(1);

      // Detailed Analysis
      doc.fontSize(14).font('Helvetica-Bold').text('Detailed Analysis');
      doc.fontSize(10).font('Helvetica');

      // Mother's Data
      doc.fontSize(12).font('Helvetica-Bold').text("Mother's Breakdown:");
      doc.fontSize(9).font('Helvetica');
      for (const [factor, value] of Object.entries(analysisData.motherData.factors)) {
        doc.text(`  • ${factor.charAt(0).toUpperCase() + factor.slice(1)}: ${value.toFixed(2)}`);
      }
      doc.text(`  Highest: ${analysisData.motherData.highest.factor} (${analysisData.motherData.highest.value.toFixed(2)})`);
      doc.text(`  Lowest: ${analysisData.motherData.lowest.factor} (${analysisData.motherData.lowest.value.toFixed(2)})`);
      doc.moveDown(0.5);

      // Father's Data
      doc.fontSize(12).font('Helvetica-Bold').text("Father's Breakdown:");
      doc.fontSize(9).font('Helvetica');
      for (const [factor, value] of Object.entries(analysisData.fatherData.factors)) {
        doc.text(`  • ${factor.charAt(0).toUpperCase() + factor.slice(1)}: ${value.toFixed(2)}`);
      }
      doc.text(`  Highest: ${analysisData.fatherData.highest.factor} (${analysisData.fatherData.highest.value.toFixed(2)})`);
      doc.text(`  Lowest: ${analysisData.fatherData.lowest.factor} (${analysisData.fatherData.lowest.value.toFixed(2)})`);
      doc.moveDown(1);

      // Comparison Analysis
      doc.fontSize(14).font('Helvetica-Bold').text('Factor Comparison');
      doc.fontSize(9).font('Helvetica');
      for (const [factor, data] of Object.entries(analysisData.comparison)) {
        const winner = data.winner === 'mother' ? 'M' : data.winner === 'father' ? 'F' : '=';
        doc.text(`  ${factor.charAt(0).toUpperCase() + factor.slice(1)}: Mother ${data.mother} vs Father ${data.father} [${winner}]`);
      }
      doc.moveDown(1);

      // Insights
      doc.fontSize(14).font('Helvetica-Bold').text('Key Insights');
      doc.fontSize(9).font('Helvetica');
      analysisData.insights.insights.forEach(insight => {
        doc.text(`• ${insight}`, { width: 450, align: 'left' });
      });
      doc.moveDown(1);

      // Recommendations
      doc.fontSize(14).font('Helvetica-Bold').text('Recommendations');
      doc.fontSize(9).font('Helvetica');
      analysisData.insights.recommendations.forEach(rec => {
        doc.text(`• ${rec}`, { width: 450, align: 'left' });
      });
      doc.moveDown(2);

      // Add chart images if available (embedded images)
      if (charts && charts.barChart && !charts.barChart.isJson) {
        try {
          doc.fontSize(12).font('Helvetica-Bold').text('Bar Chart: Mother vs Father Comparison');
          doc.image(charts.barChart, { width: 500, align: 'center' });
          doc.moveDown(0.5);
        } catch (imgError) {
          console.warn('Could not embed bar chart image', imgError.message);
        }
      }

      if (charts && charts.pieChart && !charts.pieChart.isJson) {
        try {
          doc.fontSize(12).font('Helvetica-Bold').text('Pie Chart: Total Contribution');
          doc.image(charts.pieChart, { width: 400, align: 'center' });
          doc.moveDown(0.5);
        } catch (imgError) {
          console.warn('Could not embed pie chart image', imgError.message);
        }
      }

      // Note about charts
      doc.fontSize(10).font('Helvetica-Oblique').text('Note: For interactive charts, please visit /api/visualize/configs endpoint and use Chart.js or similar library for rendering.');
      doc.moveDown(1);

      // Footer
      doc.fontSize(8).font('Helvetica').text('End of Report', { align: 'center' });
      doc.end();

      stream.on('finish', () => {
        resolve({
          success: true,
          path: reportPath,
          filename: path.basename(reportPath)
        });
      });

      stream.on('error', (err) => {
        reject({ success: false, error: err.message });
      });
    } catch (error) {
      reject({ success: false, error: error.message });
    }
  });
}

module.exports = {
  generatePDFReport
};
