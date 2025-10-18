


const isAdminUser = (req, res, next) => {
    if (req.userInfo.role == 'admin') {
        console.log('Admin Middleware is called');
        next();
    } else {
        res.status(403).json({
            success: false,
            message: 'You are not authorized to access this resource, admin role required'
        });
    }
};


module.exports = isAdminUser;