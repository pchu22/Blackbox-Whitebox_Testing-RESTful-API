const bcrypt = require('bcrypt');
const database = require('../models/database');

const controllers = {};

controllers.getUsers = (req, res) => {
    try {
        const userId = req.userId;
        const loggedInUser = database.users.find(user => user.id === parseInt(userId));

        if (!loggedInUser) {
            return res.status(404).json({ error: 'User does not exist...' });
        }

        if (loggedInUser.role !== 'admin') {
            return res.status(403).json({ error: 'Forbidden: You must be an admin to fetch user information' });
        }

        const response = database.users;
        console.log(response);
        res.status(200).json(response);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to fetch users...' });
    }
};

controllers.createUser = (req, res) => {
    try {
        const { name, password } = req.body;
        const userId = Math.floor(Math.random() * 100);

        bcrypt.hash(password, 10, function(err, encryptedPassword) {
            if (err){
                console.log('Failed to encrypt the password...');
                throw new Error('Failed to encrypt the password...');
            }

            // create function to ecnrypt
            const response = { id: userId, username: name, password: encryptedPassword, role: "user" };
            database.users.push(response);

            res.status(201).json({
                data: response,
                message: 'User has been successfully created!'
            });
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to create user...' });
    }
};

controllers.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, password, role } = req.body;
        const userId = req.userId;

        const user = database.users.find(user => user.id === parseInt(id));

        if (!user) {
            console.log(`User not found with ID ${id}`);
            return res.status(404).json({ error: `User not found with ID ${id}` });
        }

        if (user.id !== userId) {
            return res.status(403).json({ message: 'Forbidden: You cannot change other users settings' });
        }

        if (name) {
            user.username = name;
            console.log(`Updated username to: ${name}`);
        }

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;
            console.log(`Updated password`);
        }

        if (role){
            user.role = role;
            console.log(`Updated role to: ${role}`); 
        }

        res.status(204).json({
            message: 'User has been successfully updated!'
        });

        console.log('User has been successfully updated!');
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to update user' });
    }
};

module.exports = controllers;