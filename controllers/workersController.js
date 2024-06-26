const mysql = require('mysql');
const dbConfig = require('../config/dbConfig');

exports.getWorkers = (req, res) => {
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
};

exports.getWorker = (req, res) => {
    const connection = mysql.createConnection(dbConfig);
    const { id } = req.params;
    connection.connect(err => {
        if (err) {
            console.error('Error connecting to database: ' + err.stack);
            return res.status(500).send('Database connection error');
        }
        const sqlQuery = 'SELECT * FROM workers WHERE id = ?';
        connection.query(sqlQuery, [id], (err, results) => {
            if (err) {
                console.error('Error executing query:', err.message);
                return res.status(500).send('Server error');
            }
            if (results.length === 0) {
                return res.status(404).send('Worker not found');
            }
            res.json(results[0]);
            connection.end();
        });
    });
};

exports.createWorker = (req, res) => {
    const connection = mysql.createConnection(dbConfig);
    const { name_ua, name_en, subtitle_ua, subtitle_en, first_description_ua, first_description_en, second_description_ua, second_description_en, third_description_ua, third_description_en } = req.body;

    connection.connect(err => {
        if (err) {
            console.error('Error connecting to database: ' + err.stack);
            return res.status(500).send('Database connection error');
        }

        const sqlQuery = 'INSERT INTO workers (name_ua, name_en, subtitle_ua, subtitle_en, first_description_ua, first_description_en, second_description_ua, second_description_en, third_description_ua, third_description_en) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        connection.query(sqlQuery, [name_ua, name_en, subtitle_ua, subtitle_en, first_description_ua, first_description_en, second_description_ua, second_description_en, third_description_ua, third_description_en], (err, results) => {
            if (err) {
                console.error('Error executing query:', err.message);
                return res.status(500).send('Server error');
            }
            res.status(201).json({ message: 'Worker created successfully', workerId: results.insertId });
            connection.end();
        });
    });
};

exports.updateWorker = (req, res) => {
    const connection = mysql.createConnection(dbConfig);
    const { id } = req.params;
    const { name_ua, name_en, subtitle_ua, subtitle_en, first_description_ua, first_description_en, second_description_ua, second_description_en, third_description_ua, third_description_en } = req.body;

    connection.connect(err => {
        if (err) {
            console.error('Error connecting to database: ' + err.stack);
            return res.status(500).send('Database connection error');
        }

        const sqlQuery = 'UPDATE workers SET name_ua = ?, name_en = ?, subtitle_ua = ?, subtitle_en = ?, first_description_ua = ?, first_description_en = ?, second_description_ua = ?, second_description_en = ?, third_description_ua = ?, third_description_en = ? WHERE id = ?';
        connection.query(sqlQuery, [name_ua, name_en, subtitle_ua, subtitle_en, first_description_ua, first_description_en, second_description_ua, second_description_en, third_description_ua, third_description_en, id], (err, results) => {
            if (err) {
                console.error('Error executing query:', err.message);
                return res.status(500).send('Server error');
            }
            res.json({ message: 'Worker updated successfully' });
            connection.end();
        });
    });
};

exports.deleteWorker = (req, res) => {
    const connection = mysql.createConnection(dbConfig);
    const { id } = req.params;

    connection.connect(err => {
        if (err) {
            console.error('Error connecting to database: ' + err.stack);
            return res.status(500).send('Database connection error');
        }

        const sqlQuery = 'DELETE FROM workers WHERE id = ?';
        connection.query(sqlQuery, [id], (err, results) => {
            if (err) {
                console.error('Error executing query:', err.message);
                return res.status(500).send('Server error');
            }
            res.json({ message: 'Worker deleted successfully' });
            connection.end();
        });
    });
};