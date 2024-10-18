const AppError = require('./../utils/AppError');

const handleDuplicateValueErrorDB = (err) =>{
    const key = Object.keys(err.keyValue)[0];
    const value = Object.values(err.keyValue)[0];
    const message = `${key} with value "${value}" exists already`;
    console.log(message);
    return new AppError(message, 400);
};

const handleCastErrorDB = (err) =>{
    const message = `invalid ${err.path}: ${err.value}`;
    return new AppError(message, 400);
};

const handleValidationErrorDB = (err) =>{
    let messages = [];
    Object.values(err.errors).map((el) =>{
        message.push(el.message);
    });
    console.log(messages);
    return new AppError(messages.join(" , "), 400);
};

const sendDevError = (err, res) =>{
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        status: err.status,
        message: err.message,
        stack: err.stack,
        error: err,
    });
};

const sendProdError = (err, res) =>{
   if (err.isOperational) {
    return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
    });
   } else {
    console.error('error: ', err);
    return res.status(500).json({
        status: 'error',
        message: 'somethine went wrong',
    });
   };
};

const errorHandler = async (err, req, res, next) =>{
    if (process.env.NODE_ENV === "development"){
        sendDevError (err, res);
    } else {
        let error = JSON.parse(JSON.stringify(err));
        if (error.code === 11000){
            error = handleDuplicateValueErrorDB(error);
        }
        if (error.name === "CastError"){
            error = handleCastErrorDB(error);
        }
        if (error.name === "ValidationError"){
            error = handleValidationErrorDB(error);
        }
        sendProdError(error, res);
    }
    next();
};

module.exports = errorHandler;