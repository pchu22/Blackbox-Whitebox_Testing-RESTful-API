const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.body.accessToken; 

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: AccessToken has not been provided' });
    }

    jwt.verify(token, 'secret-key', (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Unauthorized: You provided an invalid AccessToken' });
        }
        const { userId, role } = decoded
        req.userId = userId;
        req.role = role;

        next();
    });
};

module.exports = verifyToken;
