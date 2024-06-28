const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const dbConfig = require('../config/dbConfig');
const multer = require('multer'); // Додайте цей рядок

const router = express.Router();
const upload = multer(); // Додайте цей рядок

router.post('/register', upload.none(), async (req, res) => {
    const connection = mysql.createConnection(dbConfig);
    const { username, email, password, role } = req.body;
    const userRole = role || 'user';

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = 'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)';

        connection.query(query, [username, email, hashedPassword, userRole], (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ message: 'User registered successfully!' });
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/login', upload.none(), (req, res) => {
    const connection = mysql.createConnection(dbConfig);
    const { email, password } = req.body;

    const query = 'SELECT * FROM users WHERE email = ?';

    connection.query(query, [email], async (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, 'your_jwt_secret', { expiresIn: '30d' });
        res.json({ message: 'Login successful', token });
    });
});

module.exports = router;
