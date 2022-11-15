require('dotenv').config();
const jwt = require('jsonwebtoken')

const tokenChecker = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
        return res.status(401).json({
            success: false,
            msg: `Aucun token fourni`,
            typeof: 'no_token'
        })
    }
    try {
        jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
            if (err) {
                return res.status(401).json({
                    success: false,
                    msg: `Accès non autorisé`,
                    typeof: 'unauthorized_access'
                });
            }
            req.decoded = decoded;
            next();
        });
    } catch (error) {
        return res.status(401).json({
            success: false,
            msg: `Accès non autorisé`,
            typeof: 'unauthorized_access'
        })
    }
}

module.exports = tokenChecker