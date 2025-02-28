//userRoute.js
const express= require('express');
const { uploadImage, resizeImage,createUser, updateUser, deleteUser, getUser, getUsers, changePassword} = require('../services/userService');
const {createUserValidator, updateUserValidator, deleteUserValidator, getUserValidator, changePasswordValidator}= require('../utils/validators/userValidator');
const {protect, allowedTo}= require('../services/authService');

const router= express.Router();

router.post('/', protect, allowedTo('admin'), uploadImage, resizeImage, createUserValidator, createUser);
router.get('/', getUsers);
router.get('/:id', getUserValidator, getUser);
router.put('/:id', protect, allowedTo('admin'), uploadImage, resizeImage, updateUserValidator, updateUser);
router.delete('/:id', protect, allowedTo('admin'),  deleteUserValidator, deleteUser);
router.put('/changepassword/:id', protect, allowedTo('admin'), changePasswordValidator, changePassword);

module.exports= router;