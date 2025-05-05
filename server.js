const express = require('express');
require('dotenv').config();
const path = require('path');

const connectDb = require('./config/db.connection');
const fileRoutes = require('./routes/file.routes');
const showRoutes = require('./routes/show.routes');
const downloadRoutes = require('./routes/download.routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());

connectDb();

app.use('/api/files', fileRoutes);
app.use('/files', showRoutes);
app.use('/files/download', downloadRoutes);

app.get('/', (req, res) => {
  res.render('index');
});

app.listen(PORT, () => console.log(`Server listening at port: ${PORT}`));
