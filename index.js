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

app.use('/orthopedic-needs', orthopedicNeedsRoutes);
app.use('/orthopedic-reason', orthopedicReasonsRoutes);
app.use('/products', productsRoutes);
app.use('/auth', authRoutes);
app.use('/workers', workersRoutes);
app.use('/reviews', reviewsRoutes);
app.use('/variations', variationRoutes);

app.use('/storage', storageRoutes);


const dbConfig = {
    host: 'ni514080.mysql.tools',
    user: 'ni514080_prostopoo',
    password: 'iX9xR(s)54',
    database: 'ni514080_prostopoo',
};

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

// CRUD operations for Orthopedic Insoles
app.get('/home/catalog/orthopedic-insoles', (req, res) => {
    const connection = mysql.createConnection(dbConfig);
    connection.connect(err => {
        if (err) {
            console.error('Error connecting to database: ' + err.stack);
            return res.status(500).send('Database connection error');
        }
        const sqlQuery = 'SELECT * FROM orthopedic_insoles';
        connection.query(sqlQuery, (err, results) => {
            if (err) {
                console.error('Error executing query:', err.message);
                return res.status(500).send('Server error');
            }
            res.json(results);
            connection.end();
        });
    });
});

app.post('/home/catalog/orthopedic-insoles', (req, res) => {
    const connection = mysql.createConnection(dbConfig);
    const { image_url, title_ua, title_en, stars, count_of_reviews, description_ua, description_en, price } = req.body;
    const sqlQuery = 'INSERT INTO orthopedic_insoles (image_url, title_ua, title_en, stars, count_of_reviews, description_ua, description_en, price) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    connection.connect(err => {
        if (err) {
            console.error('Error connecting to database: ' + err.stack);
            return res.status(500).send('Database connection error');
        }
        connection.query(sqlQuery, [image_url, title_ua, title_en, stars, count_of_reviews, description_ua, description_en, price], (err, results) => {
            if (err) {
                console.error('Error executing query:', err.message);
                return res.status(500).send('Server error');
            }
            res.status(201).send({ id: results.insertId, ...req.body });
            connection.end();
        });
    });
});

app.put('/home/catalog/orthopedic-insoles/:id', (req, res) => {
    const connection = mysql.createConnection(dbConfig);
    const { id } = req.params;
    const { image_url, title_ua, title_en, stars, count_of_reviews, description_ua, description_en, price } = req.body;
    const sqlQuery = 'UPDATE orthopedic_insoles SET image_url = ?, title_ua = ?, title_en = ?, stars = ?, count_of_reviews = ?, description_ua = ?, description_en = ?, price = ? WHERE id = ?';
    connection.connect(err => {
        if (err) {
            console.error('Error connecting to database: ' + err.stack);
            return res.status(500).send('Database connection error');
        }
        connection.query(sqlQuery, [image_url, title_ua, title_en, stars, count_of_reviews, description_ua, description_en, price, id], (err) => {
            if (err) {
                console.error('Error executing query:', err.message);
                return res.status(500).send('Server error');
            }
            res.send('Record updated successfully');
            connection.end();
        });
    });
});

app.delete('/home/catalog/orthopedic-insoles/:id', (req, res) => {
    const connection = mysql.createConnection(dbConfig);
    const { id } = req.params;
    const sqlQuery = 'DELETE FROM orthopedic_insoles WHERE id = ?';
    connection.connect(err => {
        if (err) {
            console.error('Error connecting to database: ' + err.stack);
            return res.status(500).send('Database connection error');
        }
        connection.query(sqlQuery, [id], (err, results) => {
            if (err) {
                console.error('Error executing query:', err.message);
                return res.status(500).send('Server error');
            }
            if (results.affectedRows === 0) {
                return res.status(404).send('No entry found with the given ID');
            }
            res.send(`Entry with ID ${id} deleted successfully`);
            connection.end();
        });
    });
});

// Similarly, you can add the CRUD operations for the other routes like individual orthopedic insoles, children orthopedic insoles, etc.

// CRUD operations for Individual Orthopedic Insoles
app.get('/home/catalog/individual-orthopedic-insoles', (req, res) => {
    const connection = mysql.createConnection(dbConfig);
    connection.connect(err => {
        if (err) {
            console.error('Error connecting to database: ' + err.stack);
            return res.status(500).send('Database connection error');
        }
        const sqlQuery = 'SELECT * FROM individual_orthopedic_insoles';
        connection.query(sqlQuery, (err, results) => {
            if (err) {
                console.error('Error executing query:', err.message);
                return res.status(500).send('Server error');
            }
            res.json(results);
            connection.end();
        });
    });
});

app.post('/home/catalog/individual-orthopedic-insoles', (req, res) => {
    const connection = mysql.createConnection(dbConfig);
    const { images, title_ua, title_en, article, price, about_ua, about_en, characteristics_ua, characteristics_en, type_ua, type_en, brand_ua, brand_en, producer_ua, producer_en, appointment_ua, appointment_en, material_base_ua, material_base_en, material_coating_ua, material_coating_en, size_ua, size_en, reviews } = req.body;
    const sqlQuery = 'INSERT INTO individual_orthopedic_insoles (images, title_ua, title_en, article, price, about_ua, about_en, characteristics_ua, characteristics_en, type_ua, type_en, brand_ua, brand_en, producer_ua, producer_en, appointment_ua, appointment_en, material_base_ua, material_base_en, material_coating_ua, material_coating_en, size_ua, size_en, reviews) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    connection.connect(err => {
        if (err) {
            console.error('Error connecting to database: ' + err.stack);
            return res.status(500).send('Database connection error');
        }
        connection.query(sqlQuery, [JSON.stringify(images), title_ua, title_en, article, price, about_ua, about_en, JSON.stringify(characteristics_ua), JSON.stringify(characteristics_en), type_ua, type_en, brand_ua, brand_en, producer_ua, producer_en, appointment_ua, appointment_en, material_base_ua, material_base_en, material_coating_ua, material_coating_en, size_ua, size_en, JSON.stringify(reviews)], (err, results) => {
            if (err) {
                console.error('Error executing query:', err.message);
                return res.status(500).send('Server error');
            }
            res.status(201).send({ id: results.insertId, ...req.body });
            connection.end();
        });
    });
});

app.put('/home/catalog/individual-orthopedic-insoles/:id', (req, res) => {
    const connection = mysql.createConnection(dbConfig);
    const { id } = req.params;
    const { images, title_ua, title_en, article, price, about_ua, about_en, characteristics_ua, characteristics_en, type_ua, type_en, brand_ua, brand_en, producer_ua, producer_en, appointment_ua, appointment_en, material_base_ua, material_base_en, material_coating_ua, material_coating_en, size_ua, size_en, reviews } = req.body;
    const sqlQuery = 'UPDATE individual_orthopedic_insoles SET images = ?, title_ua = ?, title_en = ?, article = ?, price = ?, about_ua = ?, about_en = ?, characteristics_ua = ?, characteristics_en = ?, type_ua = ?, type_en = ?, brand_ua = ?, brand_en = ?, producer_ua = ?, producer_en = ?, appointment_ua = ?, appointment_en = ?, material_base_ua = ?, material_base_en = ?, material_coating_ua = ?, material_coating_en = ?, size_ua = ?, size_en = ?, reviews = ? WHERE id = ?';
    connection.connect(err => {
        if (err) {
            console.error('Error connecting to database: ' + err.stack);
            return res.status(500).send('Database connection error');
        }
        connection.query(sqlQuery, [JSON.stringify(images), title_ua, title_en, article, price, about_ua, about_en, JSON.stringify(characteristics_ua), JSON.stringify(characteristics_en), type_ua, type_en, brand_ua, brand_en, producer_ua, producer_en, appointment_ua, appointment_en, material_base_ua, material_base_en, material_coating_ua, material_coating_en, size_ua, size_en, JSON.stringify(reviews), id], (err) => {
            if (err) {
                console.error('Error executing query:', err.message);
                return res.status(500).send('Server error');
            }
            res.send('Record updated successfully');
            connection.end();
        });
    });
});

app.delete('/home/catalog/individual-orthopedic-insoles/:id', (req, res) => {
    const connection = mysql.createConnection(dbConfig);
    const { id } = req.params;
    const sqlQuery = 'DELETE FROM individual_orthopedic_insoles WHERE id = ?';
    connection.connect(err => {
        if (err) {
            console.error('Error connecting to database: ' + err.stack);
            return res.status(500).send('Database connection error');
        }
        connection.query(sqlQuery, [id], (err, results) => {
            if (err) {
                console.error('Error executing query:', err.message);
                return res.status(500).send('Server error');
            }
            if (results.affectedRows === 0) {
                return res.status(404).send('No entry found with the given ID');
            }
            res.send(`Entry with ID ${id} deleted successfully`);
            connection.end();
        });
    });
});


app.get('/home/catalog/orthopedic-insoles/children-orthopedic-insoles', (req, res) => {
    const connection = mysql.createConnection(dbConfig);
    connection.connect(err => {
        if (err) {
            console.error('Error connecting to database: ' + err.stack);
            return res.status(500).send('Database connection error');
        }
        const sqlQuery = 'SELECT * FROM children_orthopedic_insoles';
        connection.query(sqlQuery, (err, results) => {
            if (err) {
                console.error('Error executing query:', err.message);
                return res.status(500).send('Server error');
            }
            res.json(results);
            connection.end();
        });
    });
});

app.post('/home/catalog/orthopedic-insoles/children-orthopedic-insoles', (req, res) => {
    const connection = mysql.createConnection(dbConfig);
    const { first_image_url, second_image_url, third_image_url, fourth_image_url, title_ua, title_en, code, price, size, about_ua, about_en, about_specials_ua, about_specials_en, characteristics_ua, characteristics_en, type_ua, type_en, brand_ua, brand_en, producer_ua, producer_en, appointment_ua, appointment_en, material_base_ua, material_base_en, material_coating_ua, material_coating_en, size_ua, size_en, reviews } = req.body;
    const sqlQuery = 'INSERT INTO children_orthopedic_insoles (first_image_url, second_image_url, third_image_url, fourth_image_url, title_ua, title_en, code, price, size, about_ua, about_en, about_specials_ua, about_specials_en, characteristics_ua, characteristics_en, type_ua, type_en, brand_ua, brand_en, producer_ua, producer_en, appointment_ua, appointment_en, material_base_ua, material_base_en, material_coating_ua, material_coating_en, size_ua, size_en, reviews) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    connection.connect(err => {
        if (err) {
            console.error('Error connecting to database: ' + err.stack);
            return res.status(500).send('Database connection error');
        }
        connection.query(sqlQuery, [first_image_url, second_image_url, third_image_url, fourth_image_url, title_ua, title_en, code, price, JSON.stringify(size), about_ua, about_en, about_specials_ua, about_specials_en, JSON.stringify(characteristics_ua), JSON.stringify(characteristics_en), type_ua, type_en, brand_ua, brand_en, producer_ua, producer_en, appointment_ua, appointment_en, material_base_ua, material_base_en, material_coating_ua, material_coating_en, size_ua, size_en, JSON.stringify(reviews)], (err, results) => {
            if (err) {
                console.error('Error executing query:', err.message);
                return res.status(500).send('Server error');
            }
            res.status(201).send({ id: results.insertId, ...req.body });
            connection.end();
        });
    });
});

app.put('/home/catalog/orthopedic-insoles/children-orthopedic-insoles/:id', (req, res) => {
    const connection = mysql.createConnection(dbConfig);
    const { id } = req.params;
    const { first_image_url, second_image_url, third_image_url, fourth_image_url, title_ua, title_en, code, price, size, about_ua, about_en, about_specials_ua, about_specials_en, characteristics_ua, characteristics_en, type_ua, type_en, brand_ua, brand_en, producer_ua, producer_en, appointment_ua, appointment_en, material_base_ua, material_base_en, material_coating_ua, material_coating_en, size_ua, size_en, reviews } = req.body;
    const sqlQuery = 'UPDATE children_orthopedic_insoles SET first_image_url = ?, second_image_url = ?, third_image_url = ?, fourth_image_url = ?, title_ua = ?, title_en = ?, code = ?, price = ?, size = ?, about_ua = ?, about_en = ?, about_specials_ua = ?, about_specials_en = ?, characteristics_ua = ?, characteristics_en = ?, type_ua = ?, type_en = ?, brand_ua = ?, brand_en = ?, producer_ua = ?, producer_en = ?, appointment_ua = ?, appointment_en = ?, material_base_ua = ?, material_base_en = ?, material_coating_ua = ?, material_coating_en = ?, size_ua = ?, size_en = ?, reviews = ? WHERE id = ?';
    connection.connect(err => {
        if (err) {
            console.error('Error connecting to database: ' + err.stack);
            return res.status(500).send('Database connection error');
        }
        connection.query(sqlQuery, [first_image_url, second_image_url, third_image_url, fourth_image_url, title_ua, title_en, code, price, JSON.stringify(size), about_ua, about_en, about_specials_ua, about_specials_en, JSON.stringify(characteristics_ua), JSON.stringify(characteristics_en), type_ua, type_en, brand_ua, brand_en, producer_ua, producer_en, appointment_ua, appointment_en, material_base_ua, material_base_en, material_coating_ua, material_coating_en, size_ua, size_en, JSON.stringify(reviews), id], (err) => {
            if (err) {
                console.error('Error executing query:', err.message);
                return res.status(500).send('Server error');
            }
            res.send('Record updated successfully');
            connection.end();
        });
    });
});

app.delete('/home/catalog/orthopedic-insoles/children-orthopedic-insoles/:id', (req, res) => {
    const connection = mysql.createConnection(dbConfig);
    const { id } = req.params;
    const sqlQuery = 'DELETE FROM children_orthopedic_insoles WHERE id = ?';
    connection.connect(err => {
        if (err) {
            console.error('Error connecting to database: ' + err.stack);
            return res.status(500).send('Database connection error');
        }
        connection.query(sqlQuery, [id], (err, results) => {
            if (err) {
                console.error('Error executing query:', err.message);
                return res.status(500).send('Server error');
            }
            if (results.affectedRows === 0) {
                return res.status(404).send('No entry found with the given ID');
            }
            res.send(`Entry with ID ${id} deleted successfully`);
            connection.end();
        });
    });
});


// CRUD operations for Universal Orthopedic Insoles
app.get('/home/catalog/orthopedic-insoles/universal-orthopedic-insoles', (req, res) => {
    const connection = mysql.createConnection(dbConfig);
    connection.connect(err => {
        if (err) {
            console.error('Error connecting to database: ' + err.stack);
            return res.status(500).send('Database connection error');
        }
        const sqlQuery = 'SELECT * FROM universal_orthopedic_insoles';
        connection.query(sqlQuery, (err, results) => {
            if (err) {
                console.error('Error executing query:', err.message);
                return res.status(500).send('Server error');
            }
            res.json(results);
            connection.end();
        });
    });
});

app.post('/home/catalog/orthopedic-insoles/universal-orthopedic-insoles', (req, res) => {
    const connection = mysql.createConnection(dbConfig);
    const { first_image_url, second_image_url, third_image_url, fourth_image_url, title_ua, title_en, code, price, sizes, about_ua, about_en, characteristics_ua, characteristics_en, type_ua, type_en, brand_ua, brand_en, producer_ua, producer_en, appointment_ua, appointment_en, material_base_ua, material_base_en, material_coating_ua, material_coating_en, size_ua, size_en, reviews } = req.body;
    const sqlQuery = 'INSERT INTO universal_orthopedic_insoles (first_image_url, second_image_url, third_image_url, fourth_image_url, title_ua, title_en, code, price, sizes, about_ua, about_en, characteristics_ua, characteristics_en, type_ua, type_en, brand_ua, brand_en, producer_ua, producer_en, appointment_ua, appointment_en, material_base_ua, material_base_en, material_coating_ua, material_coating_en, size_ua, size_en, reviews) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    connection.connect(err => {
        if (err) {
            console.error('Error connecting to database: ' + err.stack);
            return res.status(500).send('Database connection error');
        }
        connection.query(sqlQuery, [first_image_url, second_image_url, third_image_url, fourth_image_url, title_ua, title_en, code, price, JSON.stringify(sizes), about_ua, about_en, JSON.stringify(characteristics_ua), JSON.stringify(characteristics_en), type_ua, type_en, brand_ua, brand_en, producer_ua, producer_en, appointment_ua, appointment_en, material_base_ua, material_base_en, material_coating_ua, material_coating_en, size_ua, size_en, JSON.stringify(reviews)], (err, results) => {
            if (err) {
                console.error('Error executing query:', err.message);
                return res.status(500).send('Server error');
            }
            res.status(201).send({ id: results.insertId, ...req.body });
            connection.end();
        });
    });
});

app.put('/home/catalog/orthopedic-insoles/universal-orthopedic-insoles/:id', (req, res) => {
    const connection = mysql.createConnection(dbConfig);
    const { id } = req.params;
    const { first_image_url, second_image_url, third_image_url, fourth_image_url, title_ua, title_en, code, price, sizes, about_ua, about_en, characteristics_ua, characteristics_en, type_ua, type_en, brand_ua, brand_en, producer_ua, producer_en, appointment_ua, appointment_en, material_base_ua, material_base_en, material_coating_ua, material_coating_en, size_ua, size_en, reviews } = req.body;
    const sqlQuery = 'UPDATE universal_orthopedic_insoles SET first_image_url = ?, second_image_url = ?, third_image_url = ?, fourth_image_url = ?, title_ua = ?, title_en = ?, code = ?, price = ?, sizes = ?, about_ua = ?, about_en = ?, characteristics_ua = ?, characteristics_en = ?, type_ua = ?, type_en = ?, brand_ua = ?, brand_en = ?, producer_ua = ?, producer_en = ?, appointment_ua = ?, appointment_en = ?, material_base_ua = ?, material_base_en = ?, material_coating_ua = ?, material_coating_en = ?, size_ua = ?, size_en = ?, reviews = ? WHERE id = ?';
    connection.connect(err => {
        if (err) {
            console.error('Error connecting to database: ' + err.stack);
            return res.status(500).send('Database connection error');
        }
        connection.query(sqlQuery, [first_image_url, second_image_url, third_image_url, fourth_image_url, title_ua, title_en, code, price, JSON.stringify(sizes), about_ua, about_en, JSON.stringify(characteristics_ua), JSON.stringify(characteristics_en), type_ua, type_en, brand_ua, brand_en, producer_ua, producer_en, appointment_ua, appointment_en, material_base_ua, material_base_en, material_coating_ua, material_coating_en, size_ua, size_en, JSON.stringify(reviews), id], (err) => {
            if (err) {
                console.error('Error executing query:', err.message);
                return res.status(500).send('Server error');
            }
            res.send('Record updated successfully');
            connection.end();
        });
    });
});

app.delete('/home/catalog/orthopedic-insoles/universal-orthopedic-insoles/:id', (req, res) => {
    const connection = mysql.createConnection(dbConfig);
    const { id } = req.params;
    const sqlQuery = 'DELETE FROM universal_orthopedic_insoles WHERE id = ?';
    connection.connect(err => {
        if (err) {
            console.error('Error connecting to database: ' + err.stack);
            return res.status(500).send('Database connection error');
        }
        connection.query(sqlQuery, [id], (err, results) => {
            if (err) {
                console.error('Error executing query:', err.message);
                return res.status(500).send('Server error');
            }
            if (results.affectedRows === 0) {
                return res.status(404).send('No entry found with the given ID');
            }
            res.send(`Entry with ID ${id} deleted successfully`);
            connection.end();
        });
    });
});

// CRUD operations for Diabetic Orthopedic Insoles
app.get('/home/catalog/orthopedic-insoles/diabetic-orthopedic-insoles', (req, res) => {
    const connection = mysql.createConnection(dbConfig);
    connection.connect(err => {
        if (err) {
            console.error('Error connecting to database: ' + err.stack);
            return res.status(500).send('Database connection error');
        }
        const sqlQuery = 'SELECT * FROM diabetic_orthopedic_insoles';
        connection.query(sqlQuery, (err, results) => {
            if (err) {
                console.error('Error executing query:', err.message);
                return res.status(500).send('Server error');
            }
            res.json(results);
            connection.end();
        });
    });
});

app.post('/home/catalog/orthopedic-insoles/diabetic-orthopedic-insoles', (req, res) => {
    const connection = mysql.createConnection(dbConfig);
    const { first_image_url, second_image_url, third_image_url, fourth_image_url, title_ua, title_en, code, price, sizes, about_ua, about_en, characteristics_ua, characteristics_en, characteristics_specials_ua, characteristics_specials_en, type_ua, type_en, brand_ua, brand_en, producer_ua, producer_en, appointment_ua, appointment_en, material_base_ua, material_base_en, material_coating_ua, material_coating_en, size_ua, size_en, reviews } = req.body;
    const sqlQuery = 'INSERT INTO diabetic_orthopedic_insoles (first_image_url, second_image_url, third_image_url, fourth_image_url, title_ua, title_en, code, price, sizes, about_ua, about_en, characteristics_ua, characteristics_en, characteristics_specials_ua, characteristics_specials_en, type_ua, type_en, brand_ua, brand_en, producer_ua, producer_en, appointment_ua, appointment_en, material_base_ua, material_base_en, material_coating_ua, material_coating_en, size_ua, size_en, reviews) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    connection.connect(err => {
        if (err) {
            console.error('Error connecting to database: ' + err.stack);
            return res.status(500).send('Database connection error');
        }
        connection.query(sqlQuery, [first_image_url, second_image_url, third_image_url, fourth_image_url, title_ua, title_en, code, price, JSON.stringify(sizes), about_ua, about_en, JSON.stringify(characteristics_ua), JSON.stringify(characteristics_en), characteristics_specials_ua, characteristics_specials_en, type_ua, type_en, brand_ua, brand_en, producer_ua, producer_en, appointment_ua, appointment_en, material_base_ua, material_base_en, material_coating_ua, material_coating_en, size_ua, size_en, JSON.stringify(reviews)], (err, results) => {
            if (err) {
                console.error('Error executing query:', err.message);
                return res.status(500).send('Server error');
            }
            res.status(201).send({ id: results.insertId, ...req.body });
            connection.end();
        });
    });
});

app.put('/home/catalog/orthopedic-insoles/diabetic-orthopedic-insoles/:id', (req, res) => {
    const connection = mysql.createConnection(dbConfig);
    const { id } = req.params;
    const { first_image_url, second_image_url, third_image_url, fourth_image_url, title_ua, title_en, code, price, sizes, about_ua, about_en, characteristics_ua, characteristics_en, characteristics_specials_ua, characteristics_specials_en, type_ua, type_en, brand_ua, brand_en, producer_ua, producer_en, appointment_ua, appointment_en, material_base_ua, material_base_en, material_coating_ua, material_coating_en, size_ua, size_en, reviews } = req.body;
    const sqlQuery = 'UPDATE diabetic_orthopedic_insoles SET first_image_url = ?, second_image_url = ?, third_image_url = ?, fourth_image_url = ?, title_ua = ?, title_en = ?, code = ?, price = ?, sizes = ?, about_ua = ?, about_en = ?, characteristics_ua = ?, characteristics_en = ?, characteristics_specials_ua = ?, characteristics_specials_en = ?, type_ua = ?, type_en = ?, brand_ua = ?, brand_en = ?, producer_ua = ?, producer_en = ?, appointment_ua = ?, appointment_en = ?, material_base_ua = ?, material_base_en = ?, material_coating_ua = ?, material_coating_en = ?, size_ua = ?, size_en = ?, reviews = ? WHERE id = ?';
    connection.connect(err => {
        if (err) {
            console.error('Error connecting to database: ' + err.stack);
            return res.status(500).send('Database connection error');
        }
        connection.query(sqlQuery, [first_image_url, second_image_url, third_image_url, fourth_image_url, title_ua, title_en, code, price, JSON.stringify(sizes), about_ua, about_en, JSON.stringify(characteristics_ua), JSON.stringify(characteristics_en), characteristics_specials_ua, characteristics_specials_en, type_ua, type_en, brand_ua, brand_en, producer_ua, producer_en, appointment_ua, appointment_en, material_base_ua, material_base_en, material_coating_ua, material_coating_en, size_ua, size_en, JSON.stringify(reviews), id], (err) => {
            if (err) {
                console.error('Error executing query:', err.message);
                return res.status(500).send('Server error');
            }
            res.send('Record updated successfully');
            connection.end();
        });
    });
});

app.delete('/home/catalog/orthopedic-insoles/diabetic-orthopedic-insoles/:id', (req, res) => {
    const connection = mysql.createConnection(dbConfig);
    const { id } = req.params;
    const sqlQuery = 'DELETE FROM diabetic_orthopedic_insoles WHERE id = ?';
    connection.connect(err => {
        if (err) {
            console.error('Error connecting to database: ' + err.stack);
            return res.status(500).send('Database connection error');
        }
        connection.query(sqlQuery, [id], (err, results) => {
            if (err) {
                console.error('Error executing query:', err.message);
                return res.status(500).send('Server error');
            }
            if (results.affectedRows === 0) {
                return res.status(404).send('No entry found with the given ID');
            }
            res.send(`Entry with ID ${id} deleted successfully`);
            connection.end();
        });
    });
});
// CRUD operations for Sport Orthopedic Insoles
app.get('/home/catalog/orthopedic-insoles/sport-orthopedic-insoles', (req, res) => {
    const connection = mysql.createConnection(dbConfig);
    connection.connect(err => {
        if (err) {
            console.error('Error connecting to database: ' + err.stack);
            return res.status(500).send('Database connection error');
        }
        const sqlQuery = 'SELECT * FROM sport_orthopedic_insoles';
        connection.query(sqlQuery, (err, results) => {
            if (err) {
                console.error('Error executing query:', err.message);
                return res.status(500).send('Server error');
            }
            res.json(results);
            connection.end();
        });
    });
});

app.post('/home/catalog/orthopedic-insoles/sport-orthopedic-insoles', (req, res) => {
    const connection = mysql.createConnection(dbConfig);
    const { first_image_url, second_image_url, third_image_url, fourth_image_url, title_ua, title_en, code, price, sizes, about_ua, about_en, characteristics_ua, characteristics_en, type_ua, type_en, brand_ua, brand_en, producer_ua, producer_en, appointment_ua, appointment_en, material_base_ua, material_base_en, material_coating_ua, material_coating_en, size_ua, size_en, reviews } = req.body;
    const sqlQuery = 'INSERT INTO sport_orthopedic_insoles (first_image_url, second_image_url, third_image_url, fourth_image_url, title_ua, title_en, code, price, sizes, about_ua, about_en, characteristics_ua, characteristics_en, type_ua, type_en, brand_ua, brand_en, producer_ua, producer_en, appointment_ua, appointment_en, material_base_ua, material_base_en, material_coating_ua, material_coating_en, size_ua, size_en, reviews) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    connection.connect(err => {
        if (err) {
            console.error('Error connecting to database: ' + err.stack);
            return res.status(500).send('Database connection error');
        }
        connection.query(sqlQuery, [first_image_url, second_image_url, third_image_url, fourth_image_url, title_ua, title_en, code, price, JSON.stringify(sizes), about_ua, about_en, JSON.stringify(characteristics_ua), JSON.stringify(characteristics_en), type_ua, type_en, brand_ua, brand_en, producer_ua, producer_en, appointment_ua, appointment_en, material_base_ua, material_base_en, material_coating_ua, material_coating_en, size_ua, size_en, JSON.stringify(reviews)], (err, results) => {
            if (err) {
                console.error('Error executing query:', err.message);
                return res.status(500).send('Server error');
            }
            res.status(201).send({ id: results.insertId, ...req.body });
            connection.end();
        });
    });
});

app.put('/home/catalog/orthopedic-insoles/sport-orthopedic-insoles/:id', (req, res) => {
    const connection = mysql.createConnection(dbConfig);
    const { id } = req.params;
    const { first_image_url, second_image_url, third_image_url, fourth_image_url, title_ua, title_en, code, price, sizes, about_ua, about_en, characteristics_ua, characteristics_en, type_ua, type_en, brand_ua, brand_en, producer_ua, producer_en, appointment_ua, appointment_en, material_base_ua, material_base_en, material_coating_ua, material_coating_en, size_ua, size_en, reviews } = req.body;
    const sqlQuery = 'UPDATE sport_orthopedic_insoles SET first_image_url = ?, second_image_url = ?, third_image_url = ?, fourth_image_url = ?, title_ua = ?, title_en = ?, code = ?, price = ?, sizes = ?, about_ua = ?, about_en = ?, characteristics_ua = ?, characteristics_en = ?, type_ua = ?, type_en = ?, brand_ua = ?, brand_en = ?, producer_ua = ?, producer_en = ?, appointment_ua = ?, appointment_en = ?, material_base_ua = ?, material_base_en = ?, material_coating_ua = ?, material_coating_en = ?, size_ua = ?, size_en = ?, reviews = ? WHERE id = ?';
    connection.connect(err => {
        if (err) {
            console.error('Error connecting to database: ' + err.stack);
            return res.status(500).send('Database connection error');
        }
        connection.query(sqlQuery, [first_image_url, second_image_url, third_image_url, fourth_image_url, title_ua, title_en, code, price, JSON.stringify(sizes), about_ua, about_en, JSON.stringify(characteristics_ua), JSON.stringify(characteristics_en), type_ua, type_en, brand_ua, brand_en, producer_ua, producer_en, appointment_ua, appointment_en, material_base_ua, material_base_en, material_coating_ua, material_coating_en, size_ua, size_en, JSON.stringify(reviews), id], (err) => {
            if (err) {
                console.error('Error executing query:', err.message);
                return res.status(500).send('Server error');
            }
            res.send('Record updated successfully');
            connection.end();
        });
    });
});

app.delete('/home/catalog/orthopedic-insoles/sport-orthopedic-insoles/:id', (req, res) => {
    const connection = mysql.createConnection(dbConfig);
    const { id } = req.params;
    const sqlQuery = 'DELETE FROM sport_orthopedic_insoles WHERE id = ?';
    connection.connect(err => {
        if (err) {
            console.error('Error connecting to database: ' + err.stack);
            return res.status(500).send('Database connection error');
        }
        connection.query(sqlQuery, [id], (err, results) => {
            if (err) {
                console.error('Error executing query:', err.message);
                return res.status(500).send('Server error');
            }
            if (results.affectedRows === 0) {
                return res.status(404).send('No entry found with the given ID');
            }
            res.send(`Entry with ID ${id} deleted successfully`);
            connection.end();
        });
    });
});



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
