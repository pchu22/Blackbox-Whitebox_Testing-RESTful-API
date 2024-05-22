const database = require('../models/database');
const uuid = require('uuid');

const controllers = {};

controllers.getOrderById = (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        const order = database.orders.find(order => order.id === parseInt(id));

        if (!order) {
            return res.status(404).json({ message: `Order with id ${id} not found` });
        }

        if (order.userId !== userId) {
            return res.status(403).json({ message: 'Forbidden: You are not the owner of this order' });
        }

        return res.status(200).json(order);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: `Failed to fetch the order with id ${id}` });
    }
};

controllers.createOrder = (req, res) => {
    try {
        const { product } = req.body;
        const userId = req.userId;
        const orderId = uuid.v4();

        const response = { id: orderId, userId: userId, product: product };

        const orderExists = database.orders.some(order => order.id === orderId);
        if (orderExists){
            console.log(`The order with the id <${orderId}> already exists...`);
            res.status(404).json({ message: `The order with the id <${orderId}> already exists...` });
        }

        const user = database.users.find(user => user.id === parseInt(userId));
        if (!user){
            console.log(`The user with the id <${userId}> doesn't exist...`);
            res.status(404).json({ message: `The user with the id <${userId}> doesn't exist...` });
        }

        database.orders.push(response);
        res.status(201).json({
            data: response,
            message: 'Order has been successfully created!'
        });
        console.log(response);
        console.log('Order has been successfully created!');
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to create order...' });
    }
};

module.exports = controllers;