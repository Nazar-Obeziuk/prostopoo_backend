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

        const sqlQuery = 'SELECT * FROM orthopedic_reasons';
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

        const sqlQuery = 'SELECT * FROM orthopedic_advantages';
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

app.get('/home/reviews', (req, res) => {
    const connection = mysql.createConnection(dbConfig);

    console.log("ss")

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

        const { stars, name_ua, name_en, description_ua, description_en, pluses_ua, pluses_en, minuses_ua, minuses_en } = req.body;

        console.log('Received data:', req.body);

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

app.get('/reviews/:id', (req, res) => {
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
});

app.put('/reviews/:id', (req, res) => {
    const connection = mysql.createConnection(dbConfig);
    const { id } = req.params;
    const { stars, name_ua, name_en, description_ua, description_en, pluses_ua, pluses_en, minuses_ua, minuses_en } = req.body;

    connection.connect((err) => {
        if (err) {
            console.error('Error connecting to database: ' + err.stack);
            res.status(500).send('Database connection error');
            return;
        }

        console.log('Received data for update:', req.body);

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


// CRUD operations for Workers
app.get('/home/workers', (req, res) => {
    const connection = mysql.createConnection(dbConfig);
    connection.connect(err => {
        if (err) {
            console.error('Error connecting to database: ' + err.stack);
            return res.status(500).send('Database connection error');
        }
        const sqlQuery = 'SELECT * FROM workers';
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

app.post('/home/workers', (req, res) => {
    const connection = mysql.createConnection(dbConfig);
    const { image_url, name_ua, name_en, subtitle_ua, subtitle_en, first_description_ua, first_description_en, second_description_ua, second_description_en, third_description_ua, third_description_en, slider_images } = req.body;
    const sqlQuery = 'INSERT INTO workers (image_url, name_ua, name_en, subtitle_ua, subtitle_en, first_description_ua, first_description_en, second_description_ua, second_description_en, third_description_ua, third_description_en, slider_images) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    connection.connect(err => {
        if (err) {
            console.error('Error connecting to database: ' + err.stack);
            return res.status(500).send('Database connection error');
        }
        connection.query(sqlQuery, [image_url, name_ua, name_en, subtitle_ua, subtitle_en, first_description_ua, first_description_en, second_description_ua, second_description_en, third_description_ua, third_description_en, JSON.stringify(slider_images)], (err, results) => {
            if (err) {
                console.error('Error executing query:', err.message);
                return res.status(500).send('Server error');
            }
            res.status(201).send({ id: results.insertId, ...req.body });
            connection.end();
        });
    });
});

app.put('/home/workers/:id', (req, res) => {
    const connection = mysql.createConnection(dbConfig);
    const { id } = req.params;
    const { image_url, name_ua, name_en, subtitle_ua, subtitle_en, first_description_ua, first_description_en, second_description_ua, second_description_en, third_description_ua, third_description_en, slider_images } = req.body;
    const sqlQuery = 'UPDATE workers SET image_url = ?, name_ua = ?, name_en = ?, subtitle_ua = ?, subtitle_en = ?, first_description_ua = ?, first_description_en = ?, second_description_ua = ?, second_description_en = ?, third_description_ua = ?, third_description_en = ?, slider_images = ? WHERE id = ?';
    connection.connect(err => {
        if (err) {
            console.error('Error connecting to database: ' + err.stack);
            return res.status(500).send('Database connection error');
        }
        connection.query(sqlQuery, [image_url, name_ua, name_en, subtitle_ua, subtitle_en, first_description_ua, first_description_en, second_description_ua, second_description_en, third_description_ua, third_description_en, JSON.stringify(slider_images), id], (err) => {
            if (err) {
                console.error('Error executing query:', err.message);
                return res.status(500).send('Server error');
            }
            res.send('Record updated successfully');
            connection.end();
        });
    });
});

app.delete('/home/workers/:id', (req, res) => {
    const connection = mysql.createConnection(dbConfig);
    const { id } = req.params;
    const sqlQuery = 'DELETE FROM workers WHERE id = ?';
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
