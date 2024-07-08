const mysql = require('mysql');
const dbConfig = require('../config/dbConfig');

exports.getGeneralReviews = (req, res) => {
    const connection = mysql.createConnection(dbConfig);

    connection.connect((err) => {
        if (err) {
            console.error('Error connecting to database: ' + err.stack);
            res.status(500).send('Database connection error');
            return;
        }

        const sqlQuery = 'SELECT * FROM reviews WHERE category = ?';
        connection.query(sqlQuery, ['General'], (err, results) => {
            if (err) {
                console.error('Error executing query:', err.message);
                res.status(500).send('Server error');
            } else {
                res.json(results);
            }
            connection.end();
        });
    });
};

exports.getReviewsByProductId = (req, res) => {
    const connection = mysql.createConnection(dbConfig);
    const { product_id } = req.params;

    connection.connect((err) => {
        if (err) {
            console.error('Error connecting to database: ' + err.stack);
            res.status(500).send('Database connection error');
            return;
        }

        const sqlQuery = 'SELECT * FROM reviews WHERE product_id = ? AND category = ?';
        connection.query(sqlQuery, [product_id, 'product'], (err, results) => {
            if (err) {
                console.error('Error executing query:', err.message);
                res.status(500).send('Server error');
            } else {
                res.json(results);
            }
            connection.end();
        });
    });
};

exports.getReview = (req, res) => {
    const connection = mysql.createConnection(dbConfig);
    const { id } = req.params;

    connection.connect((err) => {
        if (err) {
            console.error('Error connecting to database: ' + err.stack);
            return res.status(500).send('Database connection error');
        }

        const sqlQuery = 'SELECT * FROM reviews WHERE id = ?';
        connection.query(sqlQuery, [id], (err, results) => {
            if (err) {
                console.error('Error executing query:', err.message);
                return res.status(500).send('Server error');
            }
            if (results.length === 0) {
                return res.status(404).send('No entry found with the given ID');
            }
            res.json(results[0]);
            connection.end();
        });
    });
};

exports.createGeneralReview = async (req, res) => {
    const connection = mysql.createConnection(dbConfig);

    connection.connect((err) => {
        if (err) {
            console.error('Error connecting to database: ' + err.stack);
            res.status(500).send('Database connection error');
            return;
        }

        const { stars, name_ua, name_en, description_ua, description_en, pluses_ua, pluses_en, minuses_ua, minuses_en } = req.body;

        const sqlQuery = `
            INSERT INTO reviews (stars, name_ua, name_en, description_ua, description_en, pluses_ua, pluses_en, minuses_ua, minuses_en, category) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        connection.query(sqlQuery, [stars, name_ua, name_en, description_ua, description_en, pluses_ua, pluses_en, minuses_ua, minuses_en, 'General'], (err, results) => {
            if (err) {
                console.error('Error executing query:', err.message);
                res.status(500).send('Server error');
            } else {
                res.status(201).send({ id: results.insertId, stars, name_ua, name_en, description_ua, description_en, pluses_ua, pluses_en, minuses_ua, minuses_en });
            }
            connection.end();
        });
    });
};

exports.createProductReview = (req, res) => {
    const connection = mysql.createConnection(dbConfig);
    const { product_id } = req.params;
    const { stars, name_ua, name_en, description_ua, description_en, pluses_ua, pluses_en, minuses_ua, minuses_en } = req.body;

    connection.connect((err) => {
        if (err) {
            console.error('Error connecting to database: ' + err.stack);
            res.status(500).send('Database connection error');
            return;
        }

        const sqlQuery = `
            INSERT INTO reviews (product_id, stars, name_ua, name_en, description_ua, description_en, pluses_ua, pluses_en, minuses_ua, minuses_en, category) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        connection.query(sqlQuery, [product_id, stars, name_ua, name_en, description_ua, description_en, pluses_ua, pluses_en, minuses_ua, minuses_en, 'product'], (err, results) => {
            if (err) {
                console.error('Error executing query:', err.message);
                res.status(500).send('Server error');
            } else {
                res.status(201).send({ id: results.insertId, product_id, stars, name_ua, name_en, description_ua, description_en, pluses_ua, pluses_en, minuses_ua, minuses_en });
            }
            connection.end();
        });
    });
};

exports.getCertificateReviews = (req, res) => {
    const connection = mysql.createConnection(dbConfig);

    connection.connect((err) => {
        if (err) {
            console.error('Error connecting to database: ' + err.stack);
            return res.status(500).send('Database connection error');
        }

        const sqlQuery = 'SELECT * FROM reviews WHERE category = ?';
        connection.query(sqlQuery, ['certificate'], (err, results) => {
            if (err) {
                console.error('Error executing query:', err.message);
                return res.status(500).send('Server error');
            }
            if (results.length === 0) {
                return res.status(404).send('No reviews found for the given category');
            }
            res.json(results);
            connection.end();
        });
    });
};

exports.createCertificateReview = (req, res) => {
    const connection = mysql.createConnection(dbConfig);
    const { product_id } = req.params;
    const { stars, name_ua, name_en, description_ua, description_en, pluses_ua, pluses_en, minuses_ua, minuses_en } = req.body;

    connection.connect((err) => {
        if (err) {
            console.error('Error connecting to database: ' + err.stack);
            res.status(500).send('Database connection error');
            return;
        }

        const sqlQuery = `
            INSERT INTO reviews (product_id, stars, name_ua, name_en, description_ua, description_en, pluses_ua, pluses_en, minuses_ua, minuses_en, category) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        connection.query(sqlQuery, [product_id, stars, name_ua, name_en, description_ua, description_en, pluses_ua, pluses_en, minuses_ua, minuses_en, 'certificate'], (err, results) => {
            if (err) {
                console.error('Error executing query:', err.message);
                res.status(500).send('Server error');
            } else {
                res.status(201).send({ id: results.insertId, product_id, stars, name_ua, name_en, description_ua, description_en, pluses_ua, pluses_en, minuses_ua, minuses_en });
            }
            connection.end();
        });
    });
};

exports.updateReview = (req, res) => {
    const connection = mysql.createConnection(dbConfig);
    const { id } = req.params;
    const { stars, name_ua, name_en, description_ua, description_en, pluses_ua, pluses_en, minuses_ua, minuses_en } = req.body;

    connection.connect((err) => {
        if (err) {
            console.error('Error connecting to database: ' + err.stack);
            res.status(500).send('Database connection error');
            return;
        }

        const sqlQuery = `
            UPDATE reviews 
            SET stars = ?, name_ua = ?, name_en = ?, description_ua = ?, description_en = ?, pluses_ua = ?, pluses_en = ?, minuses_ua = ?, minuses_en = ?
            WHERE id = ?
        `;

        connection.query(sqlQuery, [stars, name_ua, name_en, description_ua, description_en, pluses_ua, pluses_en, minuses_ua, minuses_en, id], (err, results) => {
            if (err) {
                console.error('Error executing query:', err.message);
                res.status(500).send('Server error');
            } else if (results.affectedRows === 0) {
                res.status(404).send('No entry found with the given ID');
            } else {
                res.status(200).send(`Entry with ID ${id} updated successfully`);
            }
            connection.end();
        });
    });
};

exports.deleteReview = (req, res) => {
    const connection = mysql.createConnection(dbConfig);
    const { id } = req.params;

    connection.connect((err) => {
        if (err) {
            console.error('Error connecting to database: ' + err.stack);
            res.status(500).send('Database connection error');
            return;
        }

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
};

exports.getIndividualReviews = (req, res) => {
    const connection = mysql.createConnection(dbConfig);

    connection.connect((err) => {
        if (err) {
            console.error('Error connecting to database: ' + err.stack);
            res.status(500).send('Database connection error');
            return;
        }

        const sqlQuery = 'SELECT * FROM reviews WHERE category = ?';
        connection.query(sqlQuery, ['individual'], (err, results) => {
            if (err) {
                console.error('Error executing query:', err.message);
                res.status(500).send('Server error');
            } else {
                res.json(results);
            }
            connection.end();
        });
    });
};

exports.createIndividualReview = (req, res) => {
    const connection = mysql.createConnection(dbConfig);
    const { stars, name_ua, name_en, description_ua, description_en, pluses_ua, pluses_en, minuses_ua, minuses_en } = req.body;

    connection.connect((err) => {
        if (err) {
            console.error('Error connecting to database: ' + err.stack);
            res.status(500).send('Database connection error');
            return;
        }

        const sqlQuery = `
            INSERT INTO reviews (stars, name_ua, name_en, description_ua, description_en, pluses_ua, pluses_en, minuses_ua, minuses_en, category) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        connection.query(sqlQuery, [stars, name_ua, name_en, description_ua, description_en, pluses_ua, pluses_en, minuses_ua, minuses_en, 'individual'], (err, results) => {
            if (err) {
                console.error('Error executing query:', err.message);
                res.status(500).send('Server error');
            } else {
                res.status(201).send({ id: results.insertId, stars, name_ua, name_en, description_ua, description_en, pluses_ua, pluses_en, minuses_ua, minuses_en });
            }
            connection.end();
        });
    });
};
