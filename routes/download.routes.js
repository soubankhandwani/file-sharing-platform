const express = require('express');
const path = require('path');

const File = require('../models/file.model');

const router = express.Router();

router.get('/:uuid', async (req, res) => {
  const uuid = req.params.uuid;

  if (!uuid) {
    return res.status(404).json({ error: 'Invalid file requested.' });
  }
  const file = await File.findOne({ uuid });

  if (!file) {
    return res.render('download', { error: 'Link has been expired.' });
  }

  const filePath = `${__dirname}/../${file.path}`;

  res.download(filePath);
});

module.exports = router;
