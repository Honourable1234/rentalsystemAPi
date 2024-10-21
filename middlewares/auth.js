const jwt = require('jsonwebtoken');
const Users = require('./../model/users');
const AppError = require('./../utils/AppError');
const protectRoute = async(req, res, next) =>{
    try {
        let token = '';
        if (req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorisation.split(' ')[1];
        }
        if (!token) {
            throw new AppError('Please login to access this route', 401);
        };
        const JWTSecret = process.env.JWTSecret;
        const decoded = jwt.verify(token, JWTSecret);
        if (!decoded) {
            throw new AppError('Invalid token supplied, please login again to continue', 401)
        };
        if(decoded.exp > Date.now()){
            throw new AppError('token has expired, please login again to continue', 401)
        };
        const userId = decoded.id;
        const user = await Users.findById(userId);
        if (!user) {
            throw new AppError('invalid user for the token supplied, please login again to continue', 404)
        };
        req.user = user;
        next();
    } catch (error) {
        next(error);
    };
};

const checkIfEmailIsVerified = async (req, res, next) =>{
    try {
        const user = req.user;
        if(!user.email_Verified){
            throw new AppError('please verify your email address to access this route', 401)
        }
        next()
    } catch (error) {
        next(error)
    }
};
 module.exports = {protectRoute, checkIfEmailIsVerified};