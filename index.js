const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4001;

const dbConfig = {
    host: 'ni514080.mysql.tools',
    user: 'ni514080_prostopoo',
    password: 'iX9xR(s)54',
    database: 'ni514080_prostopoo',
};

app.use(cors());
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'images')));

app.get('/', (req, res) => {
    res.send('Welcome to PROSTOPOO API');
});

app.get('/orthopedic-needs', (req, res) => {
    const connection = mysql.createConnection(dbConfig);

    connection.connect((err) => {
        if (err) {
            console.error('Error connecting to database: ' + err.stack);
            res.status(500).send('Database connection error');
            return;
        }

        const sqlQuery = 'SELECT * FROM orthopedic_needs';
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
            connection.end();
        });
    });
});

app.post('/orthopedic-needs', (req, res) => {
    const connection = mysql.createConnection(dbConfig);

    connection.connect((err) => {
        if (err) {
            console.error('Error connecting to database: ' + err.stack);
            res.status(500).send('Database connection error');
            return;
        }

        const { group_name_uk, group_name_en, icon_url } = req.body;
        const sqlQuery = 'INSERT INTO orthopedic_needs (group_name_uk, group_name_en, icon_url) VALUES (?, ?, ?)';
        connection.query(sqlQuery, [group_name_uk, group_name_en, icon_url], (err, results) => {
            if (err) {
                console.error('Error executing query:', err.message);
                res.status(500).send('Server error');
            } else {
                res.status(201).send({ id: results.insertId, group_name_uk, group_name_en, icon_url });
            }
            connection.end();
        });
    });
});

app.delete('/orthopedic-needs/:id', (req, res) => {
    const connection = mysql.createConnection(dbConfig);

    connection.connect((err) => {
        if (err) {
            console.error('Error connecting to database: ' + err.stack);
            res.status(500).send('Database connection error');
            return;
        }

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
            connection.end();
        });
    });
});

app.get('/orthopedic-reasons', (req, res) => {
    const connection = mysql.createConnection(dbConfig);

    connection.connect((err) => {
        if (err) {
            console.error('Error connecting to database: ' + err.stack);
            res.status(500).send('Database connection error');
            return;
        }

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
            connection.end();
        });
    });
});

app.post('/orthopedic-reasons', (req, res) => {
    const connection = mysql.createConnection(dbConfig);

    connection.connect((err) => {
        if (err) {
            console.error('Error connecting to database: ' + err.stack);
            res.status(500).send('Database connection error');
            return;
        }

        const { reason_uk, reason_en, icon_url } = req.body;
        const sqlQuery = 'INSERT INTO orthopedic_reasons (reason_uk, reason_en, icon_url) VALUES (?, ?, ?)';
        connection.query(sqlQuery, [reason_uk, reason_en, icon_url], (err, results) => {
            if (err) {
                console.error('Error executing query:', err.message);
                res.status(500).send('Server error');
            } else {
                res.status(201).send({ id: results.insertId, reason_uk, reason_en, icon_url });
            }
            connection.end();
        });
    });
});

app.delete('/orthopedic-reasons/:id', (req, res) => {
    const connection = mysql.createConnection(dbConfig);

    connection.connect((err) => {
        if (err) {
            console.error('Error connecting to database: ' + err.stack);
            res.status(500).send('Database connection error');
            return;
        }

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
            connection.end();
        });
    });
});

app.get('/orthopedic-advantages', (req, res) => {
    const connection = mysql.createConnection(dbConfig);

    connection.connect((err) => {
        if (err) {
            console.error('Error connecting to database: ' + err.stack);
            res.status(500).send('Database connection error');
            return;
        }

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
            connection.end();
        });
    });
});

app.post('/orthopedic-advantages', (req, res) => {
    const connection = mysql.createConnection(dbConfig);

    connection.connect((err) => {
        if (err) {
            console.error('Error connecting to database: ' + err.stack);
            res.status(500).send('Database connection error');
            return;
        }

        const { advantage_uk, advantage_en, icon_url } = req.body;
        const sqlQuery = 'INSERT INTO orthopedic_advantages (advantage_uk, advantage_en, icon_url) VALUES (?, ?, ?)';
        connection.query(sqlQuery, [advantage_uk, advantage_en, icon_url], (err, results) => {
            if (err) {
                console.error('Error executing query:', err.message);
                res.status(500).send('Server error');
            } else {
                res.status(201).send({ id: results.insertId, advantage_uk, advantage_en, icon_url });
            }
            connection.end();
        });
    });
});

app.delete('/orthopedic-advantages/:id', (req, res) => {
    const connection = mysql.createConnection(dbConfig);

    connection.connect((err) => {
        if (err) {
            console.error('Error connecting to database: ' + err.stack);
            res.status(500).send('Database connection error');
            return;
        }

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
            connection.end();
        });
    });
});


app.get('/experts', (req, res) => {
    const connection = mysql.createConnection(dbConfig);

    connection.connect((err) => {
        if (err) {
            console.error('Error connecting to database: ' + err.stack);
            res.status(500).send('Database connection error');
            return;
        }

        const sqlQuery = 'SELECT * FROM experts';
        connection.query(sqlQuery, (err, results) => {
            if (err) {
                console.error('Error executing query:', err.message);
                res.status(500).send('Server error');
            } else {
                res.json(results);
            }
            connection.end();
        });
    });
});

app.post('/experts', (req, res) => {
    const connection = mysql.createConnection(dbConfig);

    connection.connect((err) => {
        if (err) {
            console.error('Error connecting to database: ' + err.stack);
            res.status(500).send('Database connection error');
            return;
        }

        const { name_uk, name_en, title_uk, title_en, description_uk, description_en, certificate_urls } = req.body;
        const sqlQuery = 'INSERT INTO experts (name_uk, name_en, title_uk, title_en, description_uk, description_en, certificate_urls) VALUES (?, ?, ?, ?, ?, ?, ?)';
        connection.query(sqlQuery, [name_uk, name_en, title_uk, title_en, description_uk, description_en, JSON.stringify(certificate_urls)], (err, results) => {
            if (err) {
                console.error('Error executing query:', err.message);
                res.status(500).send('Server error');
            } else {
                res.status(201).send({ id: results.insertId, name_uk, name_en, title_uk, title_en, description_uk, description_en, certificate_urls });
            }
            connection.end();
        });
    });
});


app.delete('/experts/:id', (req, res) => {
    const connection = mysql.createConnection(dbConfig);

    connection.connect((err) => {
        if (err) {
            console.error('Error connecting to database: ' + err.stack);
            res.status(500).send('Database connection error');
            return;
        }

        const { id } = req.params;
        const sqlQuery = 'DELETE FROM experts WHERE id = ?';
        connection.query(sqlQuery, [id], (err, results) => {
            if (err) {
                console.error('Error executing query:', err.message);
                res.status(500).send('Server error');
            } else if (results.affectedRows === 0) {
                res.status(404).send('No entry found with the given ID');
            } else {
                res.status(200).send(`Entry with ID ${id} deleted successfully`);
            }
            connection.end();
        });
    });
});

app.get('/reviews', (req, res) => {
    const connection = mysql.createConnection(dbConfig);

    connection.connect((err) => {
        if (err) {
            console.error('Error connecting to database: ' + err.stack);
            res.status(500).send('Database connection error');
            return;
        }

        const sqlQuery = 'SELECT * FROM reviews';
        connection.query(sqlQuery, (err, results) => {
            if (err) {
                console.error('Error executing query:', err.message);
                res.status(500).send('Server error');
            } else {
                res.json(results);
            }
            connection.end();
        });
    });
});

app.post('/reviews', (req, res) => {
    const connection = mysql.createConnection(dbConfig);

    connection.connect((err) => {
        if (err) {
            console.error('Error connecting to database: ' + err.stack);
            res.status(500).send('Database connection error');
            return;
        }

        const { expert_id, name_uk, name_en, review_uk, review_en, rating } = req.body;
        const sqlQuery = 'INSERT INTO reviews (expert_id, name_uk, name_en, review_uk, review_en, rating) VALUES (?, ?, ?, ?, ?, ?)';
        connection.query(sqlQuery, [expert_id, name_uk, name_en, review_uk, review_en, rating], (err, results) => {
            if (err) {
                console.error('Error executing query:', err.message);
                res.status(500).send('Server error');
            } else {
                res.status(201).send({ id: results.insertId, expert_id, name_uk, name_en, review_uk, review_en, rating });
            }
            connection.end();
        });
    });
});


app.delete('/reviews/:id', (req, res) => {
    const connection = mysql.createConnection(dbConfig);

    connection.connect((err) => {
        if (err) {
            console.error('Error connecting to database: ' + err.stack);
            res.status(500).send('Database connection error');
            return;
        }

        const { id } = req.params;
        const sqlQuery = 'DELETE FROM reviews WHERE id = ?';
        connection.query(sqlQuery, [id], (err, results) => {
            if (err) {
                console.error('Error executing query:', err.message);
                res.status(500).send('Server error');
            } else if (results.affectedRows === 0) {
                res.status(404).send('No entry found with the given ID');
            } else {
                res.status(200).send(`Entry with ID ${id} deleted successfully`);
            }
            connection.end();
        });
    });
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
