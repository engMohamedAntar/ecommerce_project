const express= require('express');
const {addAddress, removeAddress, getLoggedUserAddresses}= require('../services/addressService');
const {protect, allowedTo}= require('../services/authService');

const router= express.Router();
router.use(protect, allowedTo('user'));

router.post('/', addAddress);
router.delete('/:addressid', removeAddress);
router.get('/', getLoggedUserAddresses);

module.exports= router;