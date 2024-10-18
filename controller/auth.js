const AppError = require('./../utils/AppError');
const sendEmail = require('\./../utils/email');
const Users = require('./../model/users');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const createVerificationTokenAndSendEmail = require('../utils/createlVerificationTokenAndSendEmail.js');


const register = async (req, res, next) =>{
    try {
        const {email, firstName, lastName, password, phoneNumber} = req.body;
        if(!email || !firstName || !lastName || !password){
            throw new AppError('please fill all required fields', 400)
        }
        const existingUser = await Users.findOne({email: email});
        if(existingUser){
            throw new AppError('User with the email address exists', 400)
        }
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = await Users.create({
            email,
            firstName,
            lastName,
            password: hashedPassword,
            phoneNumber,
        });
        const JWTSecret = process.env.JWTSecret;
        JWTExpiresIn = process.env.JWTExpiresIn;
        const token = jwt.sign({id: newUser._id}, JWTSecret, {expiresIn: JWTExpiresIn})
        await sendEmail({
            email: email,
            subject: 'Wellcome to our Book rental',
            message: 'We hereby welcome you to our Book rental service, where we provide you with endless varieties of attention catching and suspence packed books'
        });
        await createVerificationTokenAndSendEmail(req, newUser);
        res.status(201).json({
            status: 'success',
            message: 'User created successfully',
            data:{
                user: newUser,
                token
            }
        }) 
    } catch (error) {
        console.log('registeration error', error),
        
       next(error)
    }
}

const login = async (req, res, next) =>{
    try {
        const {email, password} = req.body;
        if(!email || !password){
            throw new AppError('Please provide email and password', 400);
        }
        const user = await Users.findOne({email: email}, '+password');
        let checkIfPasswordIsCorrect = false;
        if(user){
            checkIfPasswordIsCorrect = await bcrypt.compare(password, user?.password);
        }
        if(!user || !checkIfPasswordIsCorrect){
            throw new AppError('Invalid email or password', 400);
        }
        const JWTSecret = process.env.JWTSecret;
        JWTExpiresIn = process.env.JWTExpiresIn;
        const token = jwt.sign({id: user._id}, JWTSecret, {expiresIn: JWTExpiresIn});
        res.status(201).json({
            status: 'success',
            message: 'Login Successful',
            data:{
                user,
                token
            }
        })
    } catch (error) {
        next(error)
    }
};

const verifyEmailAddress = async (req, res, next)=>{
    try {
        const {email, verificationToken} = req.params;
        if(!email || !verificationToken){
            throw new AppError('Invalid Verification link', 400);
        }
        const user = await Users.findOne({email});
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
        const user = await Users.findOne({email});
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