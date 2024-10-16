const express = require('express');
const{
    getAllBooks,
    getSingleBook,
    addNewBook,
    updateBook,
    deleteBook
} = require('./../controller/books')
const router = express.Router()

router.route('/').get(getAllBooks).post(addNewBook);
router.route('/:id').get(getSingleBook).patch(updateBook).delete(deleteBook);

module.exports = router