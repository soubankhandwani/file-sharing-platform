const mongoose = require('mongoose');

function connectDb() {
  mongoose.connect(process.env.MONGO_URI);

  const connection = mongoose.connection;
  connection.on('open', () => console.log('Database connected.'));
  connection.on('error', (err) => console.log('Database connection failed.'));
}

module.exports = connectDb;
