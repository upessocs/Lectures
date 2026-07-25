const { loadData } = require('../services/metadataService');

function listUploads(req, res) {
  const data = loadData();
  res.json(data);
}

module.exports = listUploads;
