const AppError = require('./../utils/AppError')
const user = require('./../model/users')

const getAllUsers = async (req, res, next) =>{
    try {
        const users = await user.find()
        res.status(200).json({
            status: 'success',
            message: 'all Users gotten successfully',
            result: users.length,
            data: users,
        })
    } catch (error) {
        next(error);
    }
};
const getSingleUser = async(req, res, next) =>{
    try{
        const id = req.params.id;
        console.log(id);
        const singleUser = await user.findById(id);
        if(!singleUser){
            throw new AppError('user not found', 400)
        };
        res.status(200).json({
            status: 'success',
            message: 'user gotten successfully',
            data: singleUser,
        })
    }catch (error) {
        next(eror);
    };
};
const createNewUser = async(req, res, next) =>{
    try {
        const {firstName, lastName, password, email, phoneNumber} = req.body;
            if(!firstName || !lastName || !password || !email){
             throw new AppError("please fill all required fields", 400)
        }
        const newUser = await user.create({
            firstName,
            lastName,
            password,
            email,
            phoneNumber
        });
        if(!newUser){
            throw new AppError('error while creating new user', 404)
        }
        res.status(200).json({
            status:'success',
            message: 'user created successfully',
            data: newUser,
        })
    } catch (error) {
        next(error)
    }
}
const updateUser = async(req, res, next) =>{
    try {
        const uid = req.params.id;
        const {firstName, lastName, password, phoneNumber, email} = req.body
        const updatedUser = await user.findByIdAndUpdate(uid, req.body, {
            runValidators: true,
            new: true
        })
        res.status(200).json({
            status: 'success',
            message: 'user Updated successfully',
            data: updatedUser
        })
    } catch (error) {
        next(error)
    }
}
const deleteUser = async(req, res, next) =>{
    try {
        const id = req.params.id;
        const userToDelete = await user.findByIdAndDelete(id);
        if(!userToDelete){
            throw new AppError(`user with uid ${id} not found`, 400)
        }
        res.status(200).json({
            status: 'success',
            message: 'user deleted successfully',
        });
    } catch (error) {
        next(error);
    }
}
module.exports = {
    getSingleUser,
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser,
}