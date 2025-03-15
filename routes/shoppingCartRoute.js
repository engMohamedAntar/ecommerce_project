const express= require('express');
const {addProductToShoppingCart, getLoggedUserCart, clearLoggedUserCart, removeProductFromCart, updateCartItemQuantity}= require('../services/cartService');
const {protect, allowedTo}= require('../services/authService');

const router= express.Router();
router.use(protect, allowedTo('user'));

router.post('/', addProductToShoppingCart);
router.get('/', getLoggedUserCart);
router.delete('/:productid', removeProductFromCart);
router.delete('/', clearLoggedUserCart);
router.put('/:itemid', updateCartItemQuantity);

module.exports= router;