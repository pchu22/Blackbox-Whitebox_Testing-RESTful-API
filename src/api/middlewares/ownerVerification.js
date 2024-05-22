const database = require('../models/database');

const verifyOwner = (req, res, next) => {
    const userId = req.userId;
    const { id } = req.params;
    const timestamp = new Date().toISOString();

    const order = database.orders.find(order => order.id === parseInt(id, 10));

    if (!order) {
        console.log(`[${timestamp}] Order with id ${id} not found`);
        return res.status(404).json({
            timestamp: timestamp,
            message: 'The order with the given has not been found...' 
        });
    }

    if (order.userId === parseInt(userId, 10)) {
        return next();
    } else {
        const user = req.user ? req.user.name : 'Unknown';
        console.log(`[${timestamp}] Unauthorized access attempted by user: ${user}, resource: ${id}`);
        return res.status(403).json({
            timestamp: timestamp,
            user: user,
            error: `You don't have access to this resource`
        });
    }
}

module.exports = verifyOwner;
