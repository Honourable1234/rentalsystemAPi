const mongoose = require('mongoose')
const booksSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'please provide the Title']
    },
    author: {
        type: String,
        required: [true, 'please provide Name of the Author']
    },
    description: {
        type: String,
        required: [true, 'please provide a description of the book'],
        minLength: [25, 'password must be at least 25 characters long']
    },
    content:{
        type: String,
        required: [true, 'please provide content to your Book']
    },
    image: {
        type: String,
    }
})
const books = mongoose.model('books', booksSchema)
module.exports = books;