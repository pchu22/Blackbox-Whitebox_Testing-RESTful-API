const database = require('../models/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const controllers = {};

controllers.login = async (req, res) => {
    try {
        const { name, password } = req.body;
        
        const user = database.users.find(user => user.username === name);
        if (!user) {
            console.log('User not found...');
            return res.status(404).json({ error: 'User not found' });
        }
        
        // encrypt + compare hashes
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            console.log('Incorrect username or password! Authentication failed...');
            return res.status(401).json({ error: 'Incorrect username or password' });
        }

        const token = jwt.sign({ userId: user.id }, 'secret-key', { expiresIn: '1h' });

        return res.status(200).json({
            message: 'Successfully logged in!',
            accessToken: token,
            role: user.role
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Failed to login' });
    }
};

module.exports = controllers;