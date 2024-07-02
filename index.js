// Lib
const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');

// Config
const app = express();
const PORT = process.env.PORT || 4001;


app.use(cors());
app.use(bodyParser.json());
const upload = multer();


app.get('/', (req, res) => {
    res.send('Welcome to PROSTOPOO API');
});

// Use
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'images')));

// Routes
const orthopedicNeedsRoutes = require('./routes/orthopedicNeedsRoutes');
const orthopedicReasonsRoutes = require('./routes/orthopedicReasonsRoutes');
const productsRoutes = require('./routes/productsRoutes');
const authRoutes = require('./routes/authRoutes');
const workersRoutes = require('./routes/workersRoutes');
const reviewsRoutes = require('./routes/reviewsRoutes');
const storageRoutes = require('./routes/storageRoutes');
const variationRoutes = require('./routes/variationsRoutes');

app.use('/products', productsRoutes);
app.use('/auth', authRoutes);
app.use('/workers', workersRoutes);
app.use('/reviews', reviewsRoutes);
app.use('/variations', variationRoutes);

app.use('/storage', storageRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
