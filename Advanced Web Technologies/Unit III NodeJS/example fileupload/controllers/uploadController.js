const parseUA = require('../utils/userAgentParser');
const { addEntry } = require('../services/metadataService');

function handleUpload(req, res) {
  if (!req.file) {
    return res.send('No file uploaded');
  }

  const ua = parseUA(req);

  const entry = {
    sapid: req.body.sapid,
    name: req.body.name,
    repo: req.body.repo,
    batch: req.body.batch,
    live: req.body.ghpage,
    filename: req.file.filename,
    browser: ua.browser,
    os: ua.os,
    device: ua.device,
    timestamp: new Date().toISOString()
  };

  addEntry(entry);
  res.send('Upload successful');
}

module.exports = handleUpload;
