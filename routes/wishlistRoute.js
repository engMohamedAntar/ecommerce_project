const express= require('express');
const {addProductToWishList, removeProductFromWishList,getLoggedUserWishList}= require('../services/wishlistService');
const {protect, allowedTo}= require('../services/authService');

const router= express.Router();
router.use(protect, allowedTo('user'));

router.post('/', addProductToWishList);
router.delete('/:productid', removeProductFromWishList);
router.get('/', getLoggedUserWishList);

module.exports= router;