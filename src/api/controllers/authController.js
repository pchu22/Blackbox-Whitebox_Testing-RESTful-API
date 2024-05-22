require('dotenv').config();
const database = require('../models/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');

const controllers = {};

controllers.login = [
    check('name').isString().notEmpty(),
    check('password').isString().notEmpty(),

    async (req, res) => {
        const errors = validationResult(req);
        const timestamp = new Date().toISOString();
        const { name, password } = req.body;

        if(!errors.isEmpty()){
            console.log(`[${timestamp}] Validation error triggered by user: ${name}, errors: ${JSON.stringify(errors.array())}`);
            return res.status(400).json({
                timestamp: timestamp,
                user: name,
                errors: errors.array()
            })
        }

        try {
            const user = database.users.find(user => user.username === name);

            if (!user) {
                console.log(`[${timestamp}] User not found: ${name}`);
                return res.status(404).json({
                    timestamp: timestamp,
                    user: name,
                    error: 'User not found'
                });
            }
            
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                console.log(`[${timestamp}] Incorrect username or password for user: ${name}`);
                return res.status(401).json({
                    timestamp: timestamp,
                    user: name,
                    error: 'Incorrect username or password'
                });
            }

            const token = jwt.sign(
                { userId: user.id, role: user.role }, 
                process.env.JWT_SECRET, 
                { expiresIn: '1h' }
            );

            console.log(`[${timestamp}] Successfully logged in: ${name}`);
            return res.status(200).json({
                timestamp: timestamp,
                accessToken: token,
                user: user,
                message: 'Successfully logged in!',
            });
        } catch (error) {
            console.log(`[${timestamp}] Login failed for user: ${name}, error: ${error.message}`);
            return res.status(500).json({
                timestamp,
                user: name,
                error: 'Failed to login'
            });
        }
    }
];

module.exports = controllers;