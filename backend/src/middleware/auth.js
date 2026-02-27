const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.error('Token verification error:', err.message);
            return res.status(403).json({ error: 'Invalid or expired token' });
        }

        // Structure correcte du user
        req.user = {
            userId: user.userId,
            email: user.email
        };

        next();
    });
};

module.exports = authenticateToken;