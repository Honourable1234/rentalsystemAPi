const multer = require('multer');
const path = require('path');
const DataUri = require('datauri/parser');

const storage = multer.memoryStorage();

const imageUpload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 2 },
    fileFilter: (req, file, cb) =>{
        const filetypes = /jpg|jpeg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(
            path.extname(file.originalname).toLowerCase()
        );
        if (mimetype && extname){
            return cb(null, true);
        }
        cb(
            'Error: File upload only supports' + filetypes
        );
    },
});

const dUri = new DataUri();

const dataUri = (req) =>
    dUri.format(path.extname(req.file.originalname).to)
module.exports = { imageUpload, dataUri }