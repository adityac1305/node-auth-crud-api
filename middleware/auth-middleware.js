const jwt = require('jsonwebtoken');


const authMiddleware = (req, res, next) => {
    // Test to check if middleware is called when we try to access the pages
    // console.log('Auth Middleware is called');


    // Check if user is autheticated
    const authHeader = req.headers['authorization'];
    console.log(authHeader);

    // As there is space in the following between Bearer and token
    // Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OGVhNzI4MTk5MDQ0NzEzOGU1OTIzMmQiLCJ1c2VybmFtZSI6IkFjZSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzYwMjA5NjEwLCJleHAiOjE3NjAyMTA1MTB9.LSEGO-Gom7Pwd5sjWrdYV3AOGycHNvVbqaxAZEYHP1I
    // We need to split the string to get the token

    const token = authHeader && authHeader.split(' ')[1];

    if(!token) {
        return res.status(401).json({
            success: false,
            message: 'Acess is denied, No Token provided'
        });
    }


    // Check if token is valid

    try{

        // verify token with JWT secret key
        /*
        The verify() method does the follwing checks:
        1. Verifies the signature using your JWT_SECRET_KEY.
        2. Decodes the payload (the middle part of the token).
        3. Checks expiration (if expired, it throws an error).
        */


        const decodedTokenInfo = jwt.verify(token, process.env.JWT_SECRET_KEY);
        console.log(decodedTokenInfo);

        // Add user info to request for passing it to next middleware
        req.userInfo = decodedTokenInfo;

        // Call next middleware
        next();


    }catch(error){
        return res.status(500).json({
            success: false,
            message: 'Invalid Token'
        });
    }
};


module.exports = authMiddleware;