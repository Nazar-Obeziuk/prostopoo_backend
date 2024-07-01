
const mysql = require('mysql');
const dbConfig = require('../config/dbConfig');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const os = require('os');
const fs = require('fs');
const bucket = require('../config/firebaseConfig');


async function uploadImageToFirebase(file) {
    const tempFilePath = path.join(os.tmpdir(), file.originalname);
    fs.writeFileSync(tempFilePath, file.buffer);

    const uniqueFilename = `${uuidv4()}-${file.originalname}`;
    await bucket.upload(tempFilePath, {
        destination: `products/${uniqueFilename}`,
        metadata: {
            contentType: file.mimetype,
        },
    });

    fs.unlinkSync(tempFilePath);

    const fileRef = bucket.file(`products/${uniqueFilename}`);
    await fileRef.makePublic();

    const url = `https://storage.googleapis.com/${bucket.name}/products/${uniqueFilename}`;
    return url;
}



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
                p.id AS id,
                p.name_en AS name_en,
                p.name_ua AS name_ua,
                p.description_en AS description_en,
                p.description_ua AS description_ua,
                p.base_price AS base_price,
                p.image_url AS image_url,
                p.article AS article,
                COALESCE(AVG(r.rating), 0) AS average_rating,
                COUNT(r.id) AS reviews_count
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
                if (product.image_url) {
                    let urls = JSON.parse(product.image_url);
                    let modUrl = urls.map(el => `${serverUrl}${el.trim()}`);
                    product.image_url = modUrl;
                } else {
                    product.image_url = "[]";
                }
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
                p.image_url AS product_image_url,
                p.article AS product_article,
                COALESCE(AVG(r.rating), 0) AS product_average_rating,
                COUNT(r.id) AS product_reviews_count,
                pv.variation_type,
                pv.variation_value,
                pv.additional_price,
                pv.image_url AS variation_image_url,
                pv.article,
                pv.description_en AS variation_description_en,
                pv.description_ua AS variation_description_ua
            FROM 
                products p
            LEFT JOIN
                productVariations pv ON p.id = pv.product_id
            LEFT JOIN
                variations v ON pv.variation_id = v.id
            LEFT JOIN
                product_reviews r ON p.id = r.product_id
            WHERE 
                p.id = ${id}
            GROUP BY 
                p.id, pv.id
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

                let product_image_urls = results[0].product_image_url ? results[0].product_image_url.split(",") : [];
                let modUrl = product_image_urls.map(el => `${el.trim()}`);

                const product = {
                    product_id: results[0].product_id,
                    name_en: results[0].product_name_en,
                    name_ua: results[0].product_name_ua,
                    description_en: results[0].product_description_en,
                    description_ua: results[0].product_description_ua,
                    base_price: results[0].product_base_price,
                    image_url: modUrl,
                    average_rating: results[0].product_average_rating,
                    reviews_count: results[0].product_reviews_count,
                    reviews_count: results[0].product_reviews_count,
                    article: results[0].product_article,
                    variations: {
                        colors: [],
                        sizes: []
                    }
                };

                results.forEach(row => {
                    let variation_image_urls = row.variation_image_url ? row.variation_image_url.split(",") : [];
                    let modVariationUrl = variation_image_urls.map(el => `${serverUrl}${el.trim()}`);

                    const variation = {
                        value: row.variation_value,
                        additional_price: row.additional_price,
                        image_url: modVariationUrl,
                        article: row.article,
                        description_en: row.variation_description_en,
                        description_ua: row.variation_description_ua
                    };

                    if (row.variation_type === 'color') {
                        product.product_variations.colors.push(variation);
                    } else if (row.variation_type === 'size') {
                        product.product_variations.sizes.push(variation);
                    }
                });

                res.json(product);
            }
            connection.end();
        });
    });
};
exports.createProduct = async (req, res) => {
    const connection = mysql.createConnection(dbConfig);
    const { name_ua, name_en, description_ua, description_en, base_price, article } = req.body;

    let imageUrl = null;  // Ініціалізуємо як null
    if (req.file) { // Використовуємо req.file замість req.files.image
        try {
            const uploadedImageUrl = await uploadImageToFirebase(req.file);
            imageUrl = JSON.stringify([uploadedImageUrl]);  // Зберігаємо URL як масив
        } catch (err) {
            console.error('Error uploading image:', err);
            return res.status(500).send('Error uploading image');
        }
    }

    connection.connect(err => {
        if (err) {
            console.error('Error connecting to database: ' + err.stack);
            return res.status(500).send('Database connection error');
        }

        const sqlQuery = 'INSERT INTO products (name_ua, name_en, description_ua, description_en, base_price, image_url, article) VALUES (?, ?, ?, ?, ?, ?, ?)';
        connection.query(sqlQuery, [name_ua, name_en, description_ua, description_en, base_price, imageUrl, article], (err, results) => {
            if (err) {
                console.error('Error executing query:', err.message);
                return res.status(500).send('Server error');
            }
            res.status(201).json({ message: 'Продукт успішно створено', productId: results.insertId });
            connection.end();
        });
    });
};

exports.updateProduct = async (req, res) => {
    const connection = mysql.createConnection(dbConfig);
    const { id } = req.params;
    const { name_ua, name_en, description_ua, description_en, base_price, article } = req.body;

    let imageUrl = null;
    if (req.file) {
        try {
            const uploadedImageUrl = await uploadImageToFirebase(req.file);
            imageUrl = JSON.stringify([uploadedImageUrl]);  // Зберігаємо URL як масив
        } catch (err) {
            console.error('Error uploading image:', err);
            return res.status(500).send('Error uploading image');
        }
    }

    connection.connect(err => {
        if (err) {
            console.error('Error connecting to database: ' + err.stack);
            return res.status(500).send('Database connection error');
        }

        const sqlQuery = 'UPDATE products SET name_ua = ?, name_en = ?, description_ua = ?, description_en = ?, base_price = ?, image_url = IFNULL(?, image_url), article = ? WHERE id = ?';
        connection.query(sqlQuery, [name_ua, name_en, description_ua, description_en, base_price, imageUrl, article, id], (err, results) => {
            if (err) {
                console.error('Error executing query:', err.message);
                return res.status(500).send('Server error');
            }
            res.json({ message: 'Продукт успішно оновлено' });
            connection.end();
        });
    });
};


exports.deleteProduct = (req, res) => {
    const connection = mysql.createConnection(dbConfig);
    const { id } = req.params;

    connection.connect(err => {
        if (err) {
            console.error('Error connecting to database: ' + err.stack);
            return res.status(500).send('Database connection error');
        }

        // Видалити всі відгуки, пов'язані з продуктом
        const deleteReviewsQuery = 'DELETE FROM product_reviews WHERE product_id = ?';
        connection.query(deleteReviewsQuery, [id], (err, results) => {
            if (err) {
                console.error('Error deleting reviews:', err.message);
                return res.status(500).send('Server error');
            }

            // Видалити всі варіації, пов'язані з продуктом
            const deleteVariationsQuery = 'DELETE FROM productVariations WHERE product_id = ?';
            connection.query(deleteVariationsQuery, [id], (err, results) => {
                if (err) {
                    console.error('Error deleting variations:', err.message);
                    return res.status(500).send('Server error');
                }

                // Видалити сам продукт
                const deleteProductQuery = 'DELETE FROM products WHERE id = ?';
                connection.query(deleteProductQuery, [id], (err, results) => {
                    if (err) {
                        console.error('Error executing query:', err.message);
                        return res.status(500).send('Server error');
                    }
                    res.json({ message: 'Продукт успішно видалено' });
                    connection.end();
                });
            });
        });
    });
};