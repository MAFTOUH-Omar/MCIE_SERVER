const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Trop de requêtes créées à partir de cette IP, veuillez réessayer après quelques minutes.',
    headers: true,
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = limiter;