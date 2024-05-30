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

// Route to get orthopedic needs data
app.get('/orthopedic-needs', (req, res) => {
    const sqlQuery = 'SELECT * FROM orthopedic_needs';
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


// Route to add a new orthopedic need
app.post('/orthopedic-needs', (req, res) => {
    const { group_name_uk, group_name_en, icon_url } = req.body;
    const sqlQuery = 'INSERT INTO orthopedic_needs (group_name_uk, group_name_en, icon_url) VALUES (?, ?, ?)';
    connection.query(sqlQuery, [group_name_uk, group_name_en, icon_url], (err, results) => {
        if (err) {
            console.error('Error executing query:', err.message);
            res.status(500).send('Server error');
        } else {
            res.status(201).send({ id: results.insertId, group_name_uk, group_name_en, icon_url });
        }
    });
});

// Route to delete an orthopedic need by ID
app.delete('/orthopedic-needs/:id', (req, res) => {
    const { id } = req.params;
    const sqlQuery = 'DELETE FROM orthopedic_needs WHERE id = ?';
    connection.query(sqlQuery, [id], (err, results) => {
        if (err) {
            console.error('Error executing query:', err.message);
            res.status(500).send('Server error');
        } else if (results.affectedRows === 0) {
            res.status(404).send('No entry found with the given ID');
        } else {
            res.status(200).send(`Entry with ID ${id} deleted successfully`);
        }
    });
});



// Route to get orthopedic reasons data
app.get('/orthopedic-reasons', (req, res) => {
    const sqlQuery = 'SELECT reason_uk, reason_en, icon_url FROM orthopedic_reasons';
    connection.query(sqlQuery, (err, results) => {
        if (err) {
            console.error('Error executing query:', err.message);
            res.status(500).send('Server error');
        } else {
            results.forEach(result => {
                result.icon_url = `${req.protocol}://${req.get('host')}/images/${path.basename(result.icon_url)}`;
            });
            res.json(results);
        }
    });
});

// Route to add a new orthopedic reason
app.post('/orthopedic-reasons', (req, res) => {
    const { reason_uk, reason_en, icon_url } = req.body;
    const sqlQuery = 'INSERT INTO orthopedic_reasons (reason_uk, reason_en, icon_url) VALUES (?, ?, ?)';
    connection.query(sqlQuery, [reason_uk, reason_en, icon_url], (err, results) => {
        if (err) {
            console.error('Error executing query:', err.message);
            res.status(500).send('Server error');
        } else {
            res.status(201).send({ id: results.insertId, reason_uk, reason_en, icon_url });
        }
    });
});

// Route to delete an orthopedic reason by ID
app.delete('/orthopedic-reasons/:id', (req, res) => {
    const { id } = req.params;
    const sqlQuery = 'DELETE FROM orthopedic_reasons WHERE id = ?';
    connection.query(sqlQuery, [id], (err, results) => {
        if (err) {
            console.error('Error executing query:', err.message);
            res.status(500).send('Server error');
        } else if (results.affectedRows === 0) {
            res.status(404).send('No entry found with the given ID');
        } else {
            res.status(200).send(`Entry with ID ${id} deleted successfully`);
        }
    });
});


// Route to get orthopedic advantages data
app.get('/orthopedic-advantages', (req, res) => {
    const sqlQuery = 'SELECT advantage_uk, advantage_en, icon_url FROM orthopedic_advantages';
    connection.query(sqlQuery, (err, results) => {
        if (err) {
            console.error('Error executing query:', err.message);
            res.status(500).send('Server error');
        } else {
            results.forEach(result => {
                result.icon_url = `${req.protocol}://${req.get('host')}/images/${path.basename(result.icon_url)}`;
            });
            res.json(results);
        }
    });
});

// Route to add a new orthopedic advantage
app.post('/orthopedic-advantages', (req, res) => {
    const { advantage_uk, advantage_en, icon_url } = req.body;
    const sqlQuery = 'INSERT INTO orthopedic_advantages (advantage_uk, advantage_en, icon_url) VALUES (?, ?, ?)';
    connection.query(sqlQuery, [advantage_uk, advantage_en, icon_url], (err, results) => {
        if (err) {
            console.error('Error executing query:', err.message);
            res.status(500).send('Server error');
        } else {
            res.status(201).send({ id: results.insertId, advantage_uk, advantage_en, icon_url });
        }
    });
});

// Route to delete an orthopedic advantage by ID
app.delete('/orthopedic-advantages/:id', (req, res) => {
    const { id } = req.params;
    const sqlQuery = 'DELETE FROM orthopedic_advantages WHERE id = ?';
    connection.query(sqlQuery, [id], (err, results) => {
        if (err) {
            console.error('Error executing query:', err.message);
            res.status(500).send('Server error');
        } else if (results.affectedRows === 0) {
            res.status(404).send('No entry found with the given ID');
        } else {
            res.status(200).send(`Entry with ID ${id} deleted successfully`);
        }
    });
});


// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
