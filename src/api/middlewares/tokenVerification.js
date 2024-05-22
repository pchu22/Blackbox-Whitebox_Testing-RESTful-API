const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const tokenFromBody = req.body.accessToken;
    const timestamp = new Date().toISOString();

    if (!tokenFromBody) {
        const user = req.user ? req.user.username : 'Unknown';
        console.log(`[${timestamp}] Unauthorized access attempted by user: ${user}, AccessToken has not been provided`);
        return res.status(401).json({
            timestamp: timestamp,
            user: user,
            error: 'AccessToken has not been provided'
        });
    }

    jwt.verify(tokenFromBody, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            const user = req.user ? req.user.username : 'Unknown';
            console.log(`[${timestamp}] Unauthorized access attempted by user: ${user}, Invalid AccessToken`);
            return res.status(401).json({
                timestamp: timestamp,
                user: user,
                error: 'You provided an invalid AccessToken'
            });
        }

        if (!decoded.userId || !decoded.role) {
            const user = req.user ? req.user.username : 'Unknown';
            console.log(`[${timestamp}] Unauthorized access attempted by user: ${user}, Invalid token payload`);
            return res.status(401).json({
                timestamp: timestamp,
                user: user,
                error: 'Invalid token payload'
            });
        }

        req.decodedToken = decoded;
        req.userId = decoded.userId;
        req.role = decoded.role;
        next();
    });
};

module.exports = verifyToken;
