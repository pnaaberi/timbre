// CodeQL analysis succeeding only means analysis/upload succeeded. Gate findings too.
const fs = require('node:fs');
const path = require('node:path');

function countFindings(report) {
  if (!Array.isArray(report.runs)) throw new Error('Invalid SARIF: runs must be an array');
  return report.runs.reduce((count, run) => {
    if (run.results !== undefined && !Array.isArray(run.results)) throw new Error('Invalid SARIF results');
    return count + (run.results || []).length;
  }, 0);
}

if (require.main === module) {
  try {
    const directory = process.argv[2];
    const files = fs.readdirSync(directory).filter(name => name.endsWith('.sarif'));
    if (!files.length) throw new Error('No CodeQL SARIF reports found');
    const count = files.reduce((total, name) => total + countFindings(JSON.parse(fs.readFileSync(path.join(directory, name), 'utf8'))), 0);
    console.log(`CodeQL findings: ${count}`);
    if (count) process.exitCode = 1;
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
module.exports = { countFindings };
