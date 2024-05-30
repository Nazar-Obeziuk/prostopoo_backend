const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const path = require('path');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 4001;

// MySQL connection
const connection = mysql.createConnection({
    host: 'ni514080.mysql.tools',
    user: 'ni514080_prostopoo',
    password: 'iX9xR(s)54',
    database: 'ni514080_prostopoo',
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database: ' + err.stack);
        return;
    }
    console.log('Connected to database as ID ' + connection.threadId);
});

// Middleware
app.use(cors());
app.use(express.json());
app.use('/img', express.static(path.join(__dirname, 'img')));

// Routes
app.get('/', (req, res) => {
    res.send('Welcome to PROSTOPOO API');
});

// Route to get orthotic needs data
app.get('/orthotic-needs', (req, res) => {
    const sqlQuery = 'SELECT group_name_uk, group_name_en, icon_url FROM orthotic_needs';
    connection.query(sqlQuery, (err, results) => {
        if (err) {
            console.error('Error executing query:', err.message);
            res.status(500).send('Server error');
        } else {
            // Update icon_url to provide full path
            results.forEach(result => {
                result.icon_url = `${req.protocol}://${req.get('host')}/img/${path.basename(result.icon_url)}`;
            });
            res.json(results);
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
