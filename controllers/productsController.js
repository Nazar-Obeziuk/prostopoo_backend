
const mysql = require('mysql');
const dbConfig = require('../config/dbConfig');


exports.getProducts = (req, res) => {
    const connection = mysql.createConnection(dbConfig);
    const serverUrl = `${req.protocol}://${req.get('host')}/`;

    connection.connect(err => {
        if (err) {
            console.error('Error connecting to database: ' + err.stack);
            return res.status(500).send('Database connection error');
        }
        const sqlQuery = `
            SELECT 
                p.id AS product_id,
                p.name_en AS product_name_en,
                p.name_ua AS product_name_ua,
                p.description_en AS product_description_en,
                p.description_ua AS product_description_ua,
                p.base_price AS product_base_price,
                p.image_url AS product_image_url,
                COALESCE(AVG(r.rating), 0) AS product_average_rating,
                COUNT(r.id) AS product_reviews_count
            FROM 
                products p
            LEFT JOIN
                product_reviews r ON p.id = r.product_id
            GROUP BY 
                p.id
            ORDER BY 
                p.id;
        `;

        connection.query(sqlQuery, (err, results) => {
            if (err) {
                console.error('Error executing query:', err.message);
                return res.status(500).send('Server error');
            }

            results.forEach(product => {
                product.product_image_url = `${serverUrl}${product.product_image_url}`;
            });


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

        const serverUrl = `${req.protocol}://${req.get('host')}/`; // Динамічно визначаємо URL сервера
        const sqlQuery = `
            SELECT 
                p.id AS product_id,
                p.name_en AS product_name_en,
                p.name_ua AS product_name_ua,
                p.description_en AS product_description_en,
                p.description_ua AS product_description_ua,
                p.base_price AS product_base_price,
                CONCAT('${serverUrl}', p.image_url) AS product_image_url,
                pv.variation_type,
                pv.variation_value,
                pv.additional_price,
                CONCAT('${serverUrl}', pv.image_url) AS variation_image_url,
                pv.article,
                pv.description_en AS variation_description_en,
                pv.description_ua AS variation_description_ua
            FROM 
                products p
            LEFT JOIN
                productVariations pv ON p.id = pv.product_id
            LEFT JOIN
                variations v ON pv.variation_id = v.id
            WHERE 
                p.id = ${id}
            ORDER BY 
                p.id, pv.variation_type;
        `;

        connection.query(sqlQuery, (err, results) => {
            if (err) {
                console.error('Error executing query:', err.message);
                res.status(500).send('Server error');
            } else {
                if (results.length === 0) {
                    res.status(404).send('Product not found');
                    connection.end();
                    return;
                }

                const product = {
                    product_id: results[0].product_id,
                    name_en: results[0].product_name_en,
                    name_ua: results[0].product_name_ua,
                    description_en: results[0].product_description_en,
                    description_ua: results[0].product_description_ua,
                    base_price: results[0].product_base_price,
                    image_url: results[0].product_image_url,
                    variations: {
                        colors: [],
                        sizes: []
                    }
                };

                results.forEach(row => {
                    const variation = {
                        value: row.variation_value,
                        additional_price: row.additional_price,
                        image_url: row.variation_image_url,
                        article: row.article,
                        description_en: row.variation_description_en,
                        description_ua: row.variation_description_ua
                    };

                    if (row.variation_type === 'color') {
                        product.variations.colors.push(variation);
                    } else if (row.variation_type === 'size') {
                        product.variations.sizes.push(variation);
                    }
                });

                res.json(product);
            }
            connection.end();
        });
    });
};
