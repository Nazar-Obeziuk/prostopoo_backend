const mysql = require('mysql');
const dbConfig = require('../config/dbConfig');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const os = require('os');
const fs = require('fs');
const bucket = require('../config/firebaseConfig');

async function uploadImageToFirebase(file, existingFileName = null) {
    const tempFilePath = path.join(os.tmpdir(), file.originalname);
    fs.writeFileSync(tempFilePath, file.buffer);

    const uniqueFilename = existingFileName ? existingFileName : `${uuidv4()}-${file.originalname}`;
    const destinationPath = `products/${uniqueFilename}`;

    await bucket.upload(tempFilePath, {
        destination: destinationPath,
        metadata: {
            contentType: file.mimetype,
        },
    });

    fs.unlinkSync(tempFilePath);

    const fileRef = bucket.file(destinationPath);
    await fileRef.makePublic();

    const url = `https://storage.googleapis.com/${bucket.name}/${destinationPath}`;
    return url;
}

exports.getProducts = (req, res) => {
    const connection = mysql.createConnection(dbConfig);

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
                p.characteristics AS characteristics,
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
                    product.image_url = JSON.parse(product.image_url);
                } else {
                    product.image_url = [];
                }

                if (product.characteristics) {
                    product.characteristics = JSON.parse(product.characteristics);
                } else {
                    product.characteristics = {};
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
                p.characteristics AS product_characteristics,
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
                product_reviews r ON p.id = r.product_id
            WHERE 
                p.id = ?
            GROUP BY 
                p.id, pv.id
            ORDER BY 
                p.id, pv.variation_type;
        `;

        connection.query(sqlQuery, [id], (err, results) => {
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
                    image_url: JSON.parse(results[0].product_image_url || "[]"),
                    average_rating: results[0].product_average_rating,
                    reviews_count: results[0].product_reviews_count,
                    article: results[0].product_article,
                    characteristics: JSON.parse(results[0].product_characteristics || "{}"),
                    variations: {}
                };

                results.forEach(row => {
                    const variation = {
                        value: row.variation_value,
                        additional_price: row.additional_price,
                        image_url: JSON.parse(row.variation_image_url),
                        article: row.article,
                        description_en: row.variation_description_en,
                        description_ua: row.variation_description_ua
                    };

                    if (row.variation_type === 'colors') {
                        product.variations.colors = variation;
                    } else if (row.variation_type === 'sizes') {
                        product.variations.sizes = variation;
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
    const { name_ua, name_en, description_ua, description_en, base_price, article, characteristics } = req.body;

    console.log(characteristics);

    let imageUrl = null;
    if (req.file) {
        try {
            const uploadedImageUrl = await uploadImageToFirebase(req.file);
            imageUrl = JSON.stringify([uploadedImageUrl]);
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

        const sqlQuery = 'INSERT INTO products (name_ua, name_en, description_ua, description_en, base_price, image_url, article, characteristics) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        connection.query(sqlQuery, [name_ua, name_en, description_ua, description_en, base_price, imageUrl, article, characteristics], (err, results) => {
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
    const { name_ua, name_en, description_ua, description_en, base_price, article, characteristics } = req.body;

    try {
        connection.connect();

        const getImageQuery = 'SELECT image_url FROM products WHERE id = ?';
        const [results] = await new Promise((resolve, reject) => {
            connection.query(getImageQuery, [id], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });

        let currentImageUrls = results.length > 0 && results[0].image_url ? JSON.parse(results[0].image_url) : [];
        console.log('Current Image URLs:', currentImageUrls);

        if (req.file) {
            console.log('New image file provided');
            const existingFileName = currentImageUrls.length > 0 ? currentImageUrls[0].split('/').pop() : null;
            const uploadedImageUrl = await uploadImageToFirebase(req.file, existingFileName);
            const newImageUrl = JSON.stringify([uploadedImageUrl]);
            console.log('New Image URL:', newImageUrl);

            const sqlQuery = 'UPDATE products SET name_ua = ?, name_en = ?, description_ua = ?, description_en = ?, base_price = ?, image_url = ?, article = ?, characteristics = ? WHERE id = ?';
            await new Promise((resolve, reject) => {
                connection.query(sqlQuery, [name_ua, name_en, description_ua, description_en, base_price, newImageUrl, article, characteristics, id], (err, results) => {
                    if (err) reject(err);
                    else resolve(results);
                });
            });
        } else {
            const sqlQuery = 'UPDATE products SET name_ua = ?, name_en = ?, description_ua = ?, description_en = ?, base_price = ?, article = ?, characteristics = ? WHERE id = ?';
            await new Promise((resolve, reject) => {
                connection.query(sqlQuery, [name_ua, name_en, description_ua, description_en, base_price, article, characteristics, id], (err, results) => {
                    if (err) reject(err);
                    else resolve(results);
                });
            });
        }

        res.json({ message: 'Продукт успішно оновлено' });
    } catch (err) {
        console.error('Error updating product:', err);
        res.status(500).send('Server error');
    } finally {
        connection.end();
    }
};

exports.deleteProduct = (req, res) => {
    const connection = mysql.createConnection(dbConfig);
    const { id } = req.params;

    connection.connect(err => {
        if (err) {
            console.error('Error connecting to database: ' + err.stack);
            return res.status(500).send('Database connection error');
        }

        const getImageQuery = 'SELECT image_url FROM products WHERE id = ?';
        connection.query(getImageQuery, [id], async (err, results) => {
            if (err) {
                console.error('Error retrieving current images:', err.message);
                connection.end();
                return res.status(500).send('Server error');
            }

            let currentImageUrls = [];
            if (results.length > 0 && results[0].image_url) {
                currentImageUrls = JSON.parse(results[0].image_url);
            }

            const deleteReviewsQuery = 'DELETE FROM product_reviews WHERE product_id = ?';
            connection.query(deleteReviewsQuery, [id], (err, results) => {
                if (err) {
                    console.error('Error deleting reviews:', err.message);
                    return res.status(500).send('Server error');
                }

                const deleteVariationsQuery = 'DELETE FROM productVariations WHERE product_id = ?';
                connection.query(deleteVariationsQuery, [id], async (err, results) => {
                    if (err) {
                        console.error('Error deleting variations:', err.message);
                        return res.status(500).send('Server error');
                    }

                    const deleteProductQuery = 'DELETE FROM products WHERE id = ?';
                    connection.query(deleteProductQuery, [id], async (err, results) => {
                        if (err) {
                            console.error('Error executing query:', err.message);
                            return res.status(500).send('Server error');
                        }

                        try {
                            for (const url of currentImageUrls) {
                                const fileName = url.split('/').pop();
                                await bucket.file(`products/${fileName}`).delete();
                            }
                        } catch (err) {
                            console.error('Error deleting images from Firebase:', err);
                            return res.status(500).send('Error deleting images');
                        }

                        res.json({ message: 'Продукт успішно видалено' });
                        connection.end();
                    });
                });
            });
        });
    });
};

exports.createVariation = (req, res) => {
    const connection = mysql.createConnection(dbConfig);
    const { productId } = req.params;
    const { variation_type, variation_value, additional_price, article, description_en, description_ua } = req.body;

    connection.connect(err => {
        if (err) {
            console.error('Error connecting to database: ' + err.stack);
            return res.status(500).send('Database connection error');
        }

        const sqlQuery = 'INSERT INTO productVariations (product_id, variation_type, variation_value, additional_price, article, description_en, description_ua) VALUES (?, ?, ?, ?, ?, ?, ?)';
        connection.query(sqlQuery, [productId, variation_type, variation_value, additional_price, article, description_en, description_ua], (err, results) => {
            if (err) {
                console.error('Error executing query:', err.message);
                return res.status(500).send('Server error');
            }
            res.status(201).json({ message: 'Варіацію успішно створено', variationId: results.insertId });
            connection.end();
        });
    });
};

exports.updateVariation = (req, res) => {
    const connection = mysql.createConnection(dbConfig);
    const { id } = req.params;
    const { variation_type, variation_value, additional_price, article, description_en, description_ua } = req.body;

    connection.connect(err => {
        if (err) {
            console.error('Error connecting to database: ' + err.stack);
            return res.status(500).send('Database connection error');
        }

        const sqlQuery = 'UPDATE productVariations SET variation_type = ?, variation_value = ?, additional_price = ?, article = ?, description_en = ?, description_ua = ? WHERE id = ?';
        connection.query(sqlQuery, [variation_type, variation_value, additional_price, article, description_en, description_ua, id], (err, results) => {
            if (err) {
                console.error('Error executing query:', err.message);
                return res.status(500).send('Server error');
            }
            res.json({ message: 'Варіацію успішно оновлено' });
            connection.end();
        });
    });
};

exports.deleteVariation = (req, res) => {
    const connection = mysql.createConnection(dbConfig);
    const { id } = req.params;

    connection.connect(err => {
        if (err) {
            console.error('Error connecting to database: ' + err.stack);
            return res.status(500).send('Database connection error');
        }

        const sqlQuery = 'DELETE FROM productVariations WHERE id = ?';
        connection.query(sqlQuery, [id], (err, results) => {
            if (err) {
                console.error('Error executing query:', err.message);
                return res.status(500).send('Server error');
            }
            res.json({ message: 'Варіацію успішно видалено' });
            connection.end();
        });
    });
};
