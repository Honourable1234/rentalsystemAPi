const express = require('express');
const{
    getAllUsers,
    getSingleUser,
    createNewUser,
    updateUser,
    deleteUser
} = require('./../controller/users')
const router = express.Router()

router.route("/").get(getAllUsers).post(createNewUser);
router.route('/:id').get( getSingleUser).patch(updateUser).delete(deleteUser);

module.exports = router