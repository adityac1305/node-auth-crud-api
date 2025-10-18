const express = require('express');
const authMiddleware = require('../middleware/auth-middleware');
const adminMiddleware = require('../middleware/admin-middleware');
const router = express.Router();



router.get('/main', authMiddleware, adminMiddleware, (req, res) => {
    res.json({
        success: true,
        message: ' Welcome to the Admin Page'
    });
});



module.exports = router;