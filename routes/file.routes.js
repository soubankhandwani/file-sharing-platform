const express = require('express');
const multer = require('multer');
const path = require('path');
const { v4: uuid4 } = require('uuid');

const File = require('../models/file.model');

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
  /*
    TODOS
    Validate Request
    Store file in uploads folder
    Store in database
    Response -> Link
  */

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

module.exports = router;
