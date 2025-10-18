const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


// register controller

const registerUser = async(req, res) =>{
    try{
        // extract user information from request body
        const {username, email, password, role} = req.body;

        // check if user already exist in database
        const checkExistingUser = await User.findOne({ 
            $or: [{username}, {email}]
        });

        if(checkExistingUser){
            res.status(400).json({
                success: false,
                message: 'User is already exists either with same username or same email. Please try with a different username or email'
            });
        }

        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);


        // create a new user and save in database
        const newlyCreatedUser = await User.create({
            username,
            email,
            password: hashedPassword,
            role: role || 'user'
        });

        await newlyCreatedUser.save();

        if(newlyCreatedUser){
            res.status(201).json({
                success: true,
                message: 'User registered successfully',
            });
        }

        else{
            res.status(400).json({
                success: false,
                message: 'Error occurred while registering user'
            });
        }

    }catch(error){
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Error occurred while registering user'
        });
    }
};



// login controller

const loginUser = async(req, res) => {
    try{
        // extract user information from request body
        const {username, password} = req.body;

        // check if user already exist in database
        const checkExistingUser = await User.findOne({username});

        if(!checkExistingUser){
            return res.status(400).json({
                success: false,
                message: 'User is not registered. Please register first'
            });
        }

        // compare password
        const isPasswordMatch = await bcrypt.compare(password, checkExistingUser.password);

        if(!isPasswordMatch){
            return res.status(400).json({
                success: false,
                message: 'Invalid password'
            });
        }


        // Create user token
        const accessToken = jwt.sign({
            userId: checkExistingUser._id,
            username: checkExistingUser.username,
            role: checkExistingUser.role
        }, process.env.JWT_SECRET_KEY, {
            expiresIn: '30m'
        });


        res.status(200).json({
            success: true,
            message: 'User logged in successfully',
            accessToken
        });


    }catch(error){
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Error occurred while logging in user'
        });
    }

};



// change password

const changePassword = async (req,res) => {
    try{
        // Extract the user_ID from the decoded token
        const userId = req.userInfo.userId;

        // Extract the oldPasswordd and newPassword from the client request body
        const {oldPassword, newPassword} = req.body;

        // Find the user in the database
        const user = await User.findById(userId);

        // Check if the user exists
        if(!user){
            return res.status(400).json({
                success: false,
                message: 'User not found'
            });
        }

        // Check if the old password is correct
        const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);

        if(!isPasswordMatch){
            return res.status(400).json({
                success: false,
                message: 'Old password is incorrect'
            });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const newhashedPassword = await bcrypt.hash(newPassword, salt);

        // Update the user's password in the database
        user.password = newhashedPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password changed successfully'
        });


    }catch(error){
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Error occurred while changing password'
        });
    }

}







module.exports = {
    registerUser,
    loginUser,
    changePassword
};