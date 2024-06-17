const mysql = require('mysql');
const dbConfig = require('../config/dbConfig');
const path = require('path');

exports.getOrthopedicNeeds = (req, res) => {
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
};

exports.addOrthopedicNeed = (req, res) => {
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
};

exports.deleteOrthopedicNeed = (req, res) => {
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
};
