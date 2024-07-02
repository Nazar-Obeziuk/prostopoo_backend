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

        const sqlQuery = 'SELECT * FROM reviews WHERE product_id IS NULL';
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

        const sqlQuery = 'SELECT * FROM reviews WHERE product_id = ?';
        connection.query(sqlQuery, [product_id], (err, results) => {
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


exports.createGeneralReview = (req, res) => {
    const connection = mysql.createConnection(dbConfig);

    connection.connect((err) => {
        if (err) {
            console.error('Error connecting to database: ' + err.stack);
            res.status(500).send('Database connection error');
            return;
        }

        const { stars, name_ua, name_en, description_ua, description_en, pluses_ua, pluses_en, minuses_ua, minuses_en } = req.body;

        const sqlQuery = `
            INSERT INTO reviews (stars, name_ua, name_en, description_ua, description_en, pluses_ua, pluses_en, minuses_ua, minuses_en) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        connection.query(sqlQuery, [stars, name_ua, name_en, description_ua, description_en, pluses_ua, pluses_en, minuses_ua, minuses_en], (err, results) => {
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
            INSERT INTO reviews (product_id, stars, name_ua, name_en, description_ua, description_en, pluses_ua, pluses_en, minuses_ua, minuses_en) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        connection.query(sqlQuery, [product_id, stars, name_ua, name_en, description_ua, description_en, pluses_ua, pluses_en, minuses_ua, minuses_en], (err, results) => {
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
