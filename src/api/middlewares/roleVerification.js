const verifyRole = (req, res, next) => {
    const decodedToken = req.decodedToken;
    const userRole = decodedToken.role;
    const timestamp = new Date().toISOString();

    if (userRole === 'admin') {
        return next();
    } else {
        const user = req.user ? req.user.name : 'Unknown';
        console.log(`[${timestamp}] Unauthorized access attempted by user: ${user}, required role: 'admin'`);
        return res.status(403).json({
            timestamp,
            user,
            error: 'Forbidden: You do not have the required role for this action'
        });
    }
};

module.exports = verifyRole;
