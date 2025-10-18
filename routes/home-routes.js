const express = require('express');
const authMiddleware = require('../middleware/auth-middleware');
const router = express.Router();


router.get('/main', authMiddleware, (req, res) => {
    // Get user information from the decoded token and pass to frontend
    const {userId, username, role} = req.userInfo;
    res.json({
        success: true,
        message: ' Welcome to the Home Page',
        user:{
            _id:userId,
            username,
            role
        }
    });
});



module.exports = router;
