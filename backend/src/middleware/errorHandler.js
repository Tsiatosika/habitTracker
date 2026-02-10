const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    // Erreur de validation
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            error: 'Validation error',
            details: err.message
        });
    }

    // Erreur de duplication (PostgreSQL unique constraint)
    if (err.code === '23505') {
        return res.status(409).json({
            error: 'Resource already exists',
            details: 'A record with this value already exists'
        });
    }

    // Erreur de clé étrangère (PostgreSQL foreign key constraint)
    if (err.code === '23503') {
        return res.status(400).json({
            error: 'Invalid reference',
            details: 'Referenced resource does not exist'
        });
    }

    // Erreur JWT
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            error: 'Invalid token',
            details: 'The provided token is invalid'
        });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            error: 'Token expired',
            details: 'Please login again'
        });
    }

    // Erreur par défaut
    res.status(err.statusCode || 500).json({
        error: err.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

module.exports = errorHandler;