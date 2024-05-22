const database = require('../models/database');
const jwt = require('jsonwebtoken');

const controllers = {};

const timestamp = new Date().toISOString();

controllers.getOrderById = (req, res) => {
    try {
        const { id } = req.params;

        const order = database.orders.find(order => order.id === parseInt(id));

        return res.status(200).json({
            data: order,
            message: 'Order successfully fetched',
            timestamp
        });
    } catch (error) {
        console.log(`[${timestamp}] User ${req.userId} - Error fetching order with id ${id}: ${error.message}`);
        return res.status(500).json({
            timestamp,
            error: 'Failed to fetch order' 
        });
    }
};

controllers.createOrder = (req, res) => {
    const triggeringUser = req.user ? req.user.username : 'Unknown';

    try {
        const { product } = req.body;
        const userId = req.userId;

        if (!product) {
            console.log(`[${timestamp}] User ${triggeringUser} - Product is missing in the request`);
            return res.status(400).json({ 
                user: triggeringUser,
                timestamp,
                error: 'Product is missing in the request...' 
            });
        }

        let orderId = Math.floor(Math.random() * 1000);
        const usedOrderIds = database.orders.map(order => order.id);

        while (usedOrderIds.includes(orderId)) {
            orderId = Math.floor(Math.random() * 1000);
        }

        const user = database.users.find(user => user.id === parseInt(userId));
        if (!user) {
            console.log(`[${timestamp}] User ${userId} - User does not exist`);
            return res.status(404).json({ message: `User with id ${userId} does not exist` });
        }

        const response = { id: orderId, userId: userId, product: product };
        database.orders.push(response);

        const token = jwt.sign({ userId, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        console.log(`[${timestamp}] User ${userId} - Order created: ${JSON.stringify(response)}`);
        return res.status(201).json({
            data: response,
            token,
            message: 'Order has been successfully created',
            timestamp,
            user: triggeringUser
        });
    } catch (error) {
        console.log(`[${timestamp}] User ${triggeringUser} - Error creating order: ${error}`);
        return res.status(500).json({ error: 'Failed to create order' });
    }
};


module.exports = controllers;