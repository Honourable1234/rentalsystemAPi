const express = require ('express')
const morgan = require('morgan')
const cors = require('cors');
const errorHandler = require('./middlewares/error')
const AppError = require('./utils/AppError')
const userRoutes = require('./routes/users')
const bookRoutes = require('./routes/books')
const authRoutes = require('./routes/auth')
const App = express()


App.use(cors())
App.use(morgan('dev'))
App.use(express.json());
App.use(express.urlencoded({ extended: true }));


App.use("/api/v1/users", userRoutes);
App.use("/api/v1/books", bookRoutes);
App.use("api/v1/auth", authRoutes);

App.all('*', (req, res)=>{
    const message = new AppError(
        `can't find ${req.originalUrl} with method ${req.method} on this server`
    );
    res.status(404).json({
        status: "error",
        message: message,
    });
});

App.use(errorHandler);

module.exports = App;