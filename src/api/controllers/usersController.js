const bcrypt = require('bcrypt');
const database = require('../models/database');
const jwt = require('jsonwebtoken');

const controllers = {};
const timestamp = new Date().toISOString();

controllers.getUsers = (req, res) => {
    try {
        const userId = req.userId;

        const loggedInUser = database.users.find(user => user.id === parseInt(userId, 10));

        if (loggedInUser.role !== 'admin') {
            const user = req.user ? req.user.username : 'Unknown';
            console.log(`[${timestamp}] User does not exist for user: ${user}`);
            return res.status(403).json({
                timestamp: timestamp,
                user: user,
                error: 'You must be an admin to fetch user information'
            });
        }

        const response = database.users;
        console.log(`[${timestamp}] Response sent for user: ${loggedInUser.username}`);
        res.status(200).json({
            timestamp: timestamp,
            user: loggedInUser.username,
            data: response
        });
        
    } catch (error) {
        const user = req.user ? req.user.username : 'Unknown';
        console.log(`[${timestamp}] Failed to fetch users...`);
        return res.status(500).json({
            timestamp: timestamp,
            user: user,
            error: 'Failed to fetch users...'
        });
    }
};

controllers.createUser = async (req, res) => {
    const triggeringUser = req.user ? req.user.username : 'Unknown';
    
    try {
        const { name, password } = req.body;
        const userId = Math.floor(Math.random() * 1000);
        const invalidUsernamePattern = /^[.\s]|.*[\\/\[\]:;|=,+*?<> \s].*|^$/;
        
        if(!name || !password){
            console.log(`[${timestamp}] Error creating a new user: Information is missing... \nTriggered by: ${triggeringUser}`);
            return res.status(400).json({ 
                timestamp: timestamp,
                user: triggeringUser,
                error: 'Error creating a new user: Information is missing...'
            });
        }
        
        if (invalidUsernamePattern.test(name)) {
            console.log(`[${timestamp}] Error creating a new user: Username contains forbidden characters or is invalid... \nTriggered by: ${triggeringUser}`);
            return res.status(400).json({
                timestamp: timestamp,
                user: triggeringUser,
                error: 'Error creating a new user: Username contains forbidden characters or is invalid...'
            });
        }

        const encryptedPassword = await bcrypt.hash(password, 10);

        const user = {
            id: userId,
            username: name,
            password: encryptedPassword,
            role: "user"
        };

        database.users.push(user);

        const token = jwt.sign({ userId, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        console.log(`[${timestamp}] User ${triggeringUser} created a new user with username ${name}`);

        return res.status(201).json({
            data: [user],
            token,
            message: 'User has been successfully created!',
            timestamp,
            user: triggeringUser
        });
    } catch (error) {
        console.log(`[${timestamp}] Failed to create user...`);
        return res.status(500).json({
            timestamp: timestamp,
            user: triggeringUser,
            error: 'Failed to create user...'
        });    
    }
};

controllers.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, password, role } = req.body;

        const user = database.users.find(user => user.id === parseInt(id));

        if (!user) {
            console.log(`User not found with ID ${id}`);
            return res.status(404).json({ error: `User not found with ID ${id}` });
        }

        if (name) {
            user.username = name;
            console.log(`[${timestamp}] Usarname updated to: ${name}`);
        }

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;
            console.log(`[${timestamp}] Password updated`);
        }

        if (role){
            user.role = role;
            console.log(`[${timestamp}] Role updated to: ${role}`); 
        }

        res.status(200).json({
            data: [user],
            timestamp,
            message: 'User has been successfully updated!'
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ 
            timestamp,
            error: 'Failed to update user' 
        });
    }
}

module.exports = controllers;