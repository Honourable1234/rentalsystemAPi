const book = require('./../model/books')
const AppError = require('./../utils/AppError')
const { dataUri } = require("./../utils/multer");
const { uploader } = require("./../config/cloudinary");

const getAllBooks = async (req, res, next) =>{
    try {
        const books = await book.find()
        res.status(200).json({
            status: 'success',
            message: 'all Books gotten successfully',
            result: books.length,
            data: books,
        })
    } catch (error) {
        next(error);
    }
};
const getSingleBook = async(req, res, next) =>{
    try{
        const uid = req.params.id;
        console.log(uid);
        const singleBook = await book.findById(uid);
        if(!singleBook){
            throw new AppError('user not found', 404)
        };
        res.status(200).json({
            status: 'success',
            message: 'Book gotten successfully',
            data: singleBook,
        })
    }catch (error) {
        next(error);
    };
};
const addNewBook = async(req, res, next) =>{
    try {
        const {title, description, content} = req.body;
        if(!title || !description || !content){
             throw new AppError("please fill all required fields", 400)
        }
        const newBook = await book.create({
            title, 
            description, 
            content,
        });
        if(!newBook){
            throw new AppError('error while adding new book', 404)
        }
        res.status(200).json({
            status:'success',
            message: 'book added successfully',
            data: newBook,
        })
    } catch (error) {
        next(error);
    }
}
const updateBook = async(req, res, next) =>{
    try {
        const id = req.params.id;
        const {title, author, description, content} = req.body;
        const updatedBook = await book.findByIdAndUpdate(id, req.body, {
            runValidators: true,
            new: true
        })
        res.status(200).json({
            status: 'success',
            message: 'book Updated successfully',
            data: updatedBook
        })
    } catch (error) {
        next(error);
    }
}
const deleteBook = async(req, res, next) =>{
    try {
        const id = req.params.id;
        const bookToDelete = await book.findByIdAndDelete(id);
        if(!bookToDelete){
            throw new AppError(`book with id ${id} not found`, 400)
        }
        res.status(200).json({
            status: 'success',
            message: 'book deleted successfully',
        });
    } catch (error) {
        next(error);
    }
}
module.exports = {
    getSingleBook,
    getAllBooks,
    addNewBook,
    updateBook,
    deleteBook,
}