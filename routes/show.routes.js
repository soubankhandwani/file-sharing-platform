const express = require('express');
const File = require('../models/file.model');

const router = express.Router();

router.get('/:uuid', async (req, res) => {
  try {
    // Check is uuid exists.
    const uuid = req.params.uuid;
    if (!uuid) {
      return res.status(400).json({ error: 'Invalid file requested.' });
    }

    // Request file from the DB for the given uuid.
    const file = await File.findOne({ uuid });
    if (!file) {
      return res.status(404).json({
        error: 'Requested file does not exists or it may have expired!',
      });
    }

    // Send these fields to the frontend if requested file is found
    return res.render('download', {
      uuid: file.uuid,
      filename: file.filename,
      filesize: file.size,
      download: `${process.env.APP_BASE_URL}/files/download/${file.uuid}`,
    });
  } catch (err) {
    console.log(err.message);
    // Return an error page if any error.
    return res.render('download', { error: 'Something went wrong.' });
  }
});

module.exports = router;
