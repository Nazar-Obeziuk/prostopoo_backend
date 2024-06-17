
const mysql = require('mysql');
const dbConfig = require('../config/dbConfig');


exports.getProducts = (req, res) => {
    const connection = mysql.createConnection(dbConfig);
    connection.connect(err => {
        if (err) {
            console.error('Error connecting to database: ' + err.stack);
            return res.status(500).send('Database connection error');
        }
        const sqlQuery = 'SELECT * FROM products';
        connection.query(sqlQuery, (err, results) => {
            if (err) {
                console.error('Error executing query:', err.message);
                return res.status(500).send('Server error');
            }
            res.json(results);
            connection.end();
        });
    });
};

exports.getProduct = (req, res) => {
    const connection = mysql.createConnection(dbConfig);
    const { id } = req.params;
    connection.connect(err => {
        if (err) {
            console.error('Error connecting to database: ' + err.stack);
            return res.status(500).send('Database connection error');
        }
        const sqlQuery = `SELECT 
            p.id AS product_id,
            p.name_en AS product_name_en,
            p.name_uk AS product_name_uk,
            p.description_en AS product_description_en,
            p.description_uk AS product_description_uk,
            p.base_price AS product_base_price,
            p.image_url AS product_image_url,
            v.type AS variation_type,
            v.description AS variation_description,
            pv.variation_value AS variation_value,
            pv.additional_price AS variation_additional_price,
            pv.image_url AS variation_image_url
        FROM 
            products p
        LEFT JOIN
            productVariations pv ON p.id = pv.product_id
        LEFT JOIN
            variations v ON pv.variation_id = v.id
        WHERE 
            p.id = ${id}
        ORDER BY 
            p.id, v.id;
        `;

        connection.query(sqlQuery, (err, results) => {
            if (err) {
                console.error('Error executing query:', err.message);
                return res.status(500).send('Server error');
            }
            res.json(results);
            connection.end();
        });
    });
};