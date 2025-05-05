const express = require('express');
const multer = require('multer');
const path = require('path');
const { v4: uuid4 } = require('uuid');

const File = require('../models/file.model');
const sendmail = require('../services/email.service');
const emailTemplate = require('../services/email.template');
const router = express.Router();

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;

    // 04052025-235789347.jpg
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage: storage,
  limit: { fileSize: 1000000 * 100 },
}).single('myfile');

router.post('/', (req, res) => {
  // Store files in uploads folder
  upload(req, res, async (err) => {
    // Validate Request
    if (!req.file) {
      return res
        .status(400)
        .json({ error: 'File is mandatory to be uploaded!' });
    }

    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // Store in database
    const file = new File({
      filename: req.file.filename,
      uuid: uuid4(),
      path: req.file.path,
      size: req.file.size,
    });

    const response = await file.save();
    return res.json({
      // http://localhost:5000/files/23fkjf3r3-38358fhhfjf
      file: `${process.env.APP_BASE_URL}/files/${response.uuid}`,
    });
  });
});

router.post('/send', async (req, res) => {
  const { uuid, emailTo, emailFrom } = req.body;

  if (!uuid || !emailFrom || !emailTo) {
    return res.status(400).json({ error: 'All fields are mandatory.' });
  }

  const file = await File.findOne({ uuid });

  if (!file) {
    return res.status(404).json({ error: 'File link expired.' });
  }

  if (file.sender) {
    return res.status(403).json({ error: 'Email link already sent.' });
  }

  file.sender = emailFrom;
  file.receiver = emailTo;

  const result = await file.save();

  sendmail({
    from: emailFrom,
    to: emailTo,
    subject: 'You have been shared a file',
    html: emailTemplate({
      emailFrom: emailFrom,
      downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}`,
      size: parseInt(file.size / 1000) + ' KB',
      expires: '24 hours',
    }),
  });

  return res.status(200).json({ success: true });
});

module.exports = router;
