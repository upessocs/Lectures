const fs = require('fs');
const { dataFile } = require('../config/paths');

function loadData() {
  if (!fs.existsSync(dataFile)) return [];
  return JSON.parse(fs.readFileSync(dataFile));
}

function saveData(data) {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

function addEntry(entry) {
  const data = loadData();
  data.push(entry);
  saveData(data);
}

module.exports = {
  loadData,
  saveData,
  addEntry
};
