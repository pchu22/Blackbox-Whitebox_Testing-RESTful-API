const verifyId = (req, res, next) => {
    const userId = req.userId;
    const { id } = req.params;
    const timestamp = new Date().toISOString();

    if(userId === parseInt(id, 10)){
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

module.exports = verifyId;