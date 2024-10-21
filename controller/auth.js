const AppError = require('./../utils/AppError');
const sendEmail = require('\./../utils/email');
const users = require('./../model/users');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const createVerificationTokenAndSendEmail = require('../utils/createlVerificationTokenAndSendEmail.js');
const { log } = require('console');


const register = async (req, res, next) => {
    try {
        const { email, firstName, lastName, password, phoneNumber } = req.body;
        console.log(password);
        
        // Check if required fields are present
        if (!email || !firstName || !lastName || !password) {
            throw new AppError('Please fill all required fields', 400);
        }

        // Check if the user already exists
        const existingUser = await users.findOne({ email: email });
        if (existingUser) {
            throw new AppError('User with this email address already exists', 400);
        }

        // Hash the password
        const saltRounds =  10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create the new user
        const newUser = await users.create({
            email,
            firstName,
            lastName,
            password: hashedPassword,
            phoneNumber,
        });

        // Generate JWT token
        const JWTSecret = process.env.JWTSecret;
        const JWTExpiresIn = process.env.JWTExpiresIn;
        const token = jwt.sign({ id: newUser._id }, JWTSecret, { expiresIn: JWTExpiresIn });

        // Send welcome email
        await sendEmail({
            email: email,
            subject: 'Welcome to our Book Rental',
            message: 'We hereby welcome you to our Book rental service...',
        });

        // Send verification email
        await createVerificationTokenAndSendEmail(req, newUser);

        // Respond to client
        res.status(201).json({
            status: 'success',
            message: 'User created successfully',
            data: {
                user: newUser,
                token
            }
        });
    } catch (error) {
        next(error); // Pass error to middleware
    }
}

const login = async (req, res, next) => {
    const { email, password} = req.body;

    try {
        // Check if email and password are provided
        if (!email) {
            throw new AppError('Please provide email and password', 400);
        }

        // Find user and include password in the query
        const user = await users.findOne({ email: email });
        console.log(user);
        console.log(password);
        
        
        // Check if the user exists
        if (!user) {
            throw new AppError('Invalid email', 400);
        }
    
        // Compare the entered password with the hashed one
        const hash = user.password
        const checkIfPasswordIsCorrect = await bcrypt.compare(password, hash);
        if (!checkIfPasswordIsCorrect) {
            throw new AppError('Invalid password', 400);
        }

        // Check if email is verified
        if (!user.email_verified) {
            throw new AppError('Email is not verified. Please verify your email before logging in.', 403);
        }

        // Generate JWT token
        const JWTSecret = process.env.JWTSecret;
        const JWTExpiresIn = process.env.JWTExpiresIn;
        const token = jwt.sign({ id: user._id }, JWTSecret, { expiresIn: JWTExpiresIn });

        // Respond to client
        res.status(201).json({
            status: 'success',
            message: 'Login successful',
            data: {
                user,
                token
            }
        });
    } catch (error) {
        console.log(error);
        next(error); // Pass error to middleware
    }
};

const verifyEmailAddress = async (req, res, next)=>{
    try {
        const {email, verificationToken} = req.params;
        if(!email || !verificationToken){
            throw new AppError('Invalid Verification link', 400);
        }
        const user = await users.findOne({email});
        if(!user){
            throw new AppError('User with Email Address not found', 404);
        }
        if(user.email_verified){
            throw new AppError('User Email is already verified', 400)
        }
        const isTokenValid = await bcrypt.compare(
            verificationToken,
            user.verification_token
        );
        if (!isTokenValid){
            throw new AppError('Invalid verification Token', 400);
        }
        user.email_verified = true;
        user.verification_token = undefined;
        await user.save();
        res.status(200).json({
            status: 'success',
            message: 'Email Verified Successfully'
        });
    } catch (error) {
        next(error)
    }
}

const resendEmailVerificationURL = async (req, res, next)=>{
    try {
        const {email} = req.body;
        if(!email){
            throw new AppError('Please provide email', 400);
        }
        const user = await users.findOne({email});
        if(!user){
            throw new AppError('User with the email address not found', 404)
        }
        await createVerificationTokenAndSendEmail(req, user);
        res.status(200).json({
            status: 'Success',
            message: 'Verification URL Resent Successfully'
        })
    } catch (error) {
        next(error)
    }
}
module.exports = {
    register,
    login,
    verifyEmailAddress,
    resendEmailVerificationURL};