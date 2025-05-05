const File = require('./models/file.model');
require('dotenv').config();
const fs = require('fs');

const connectDb = require('./config/db.connection');

async function fetchData() {
  try {
    const lastDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const files = await File.find({ createdAt: { $lt: lastDate } });

    for (const file of files) {
      fs.unlinkSync(file.path);
    }
  } catch (err) {
    console.log(err);
  }

  console.log('Job Done!');
}

connectDb();
fetchData().then(() => {
  process.exit();
});
