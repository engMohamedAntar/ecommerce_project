//orderRoute.js
const express= require('express');
const {createCashOrder, getAllOrders, getSingleOrder, updateOrderToPaid, updateOrderToDelivered, filterOrders, createCheckoutSession}= require('../services/orderService');
const {protect, allowedTo}= require('../services/authService');

const router= express.Router();

router.get('/', protect, allowedTo('admin', 'user'), filterOrders, getAllOrders);
router.get('/:id', protect, allowedTo('admin', 'user'), getSingleOrder);
router.put('/:id/pay', protect, allowedTo('admin'), updateOrderToPaid);
router.put('/:id/deliver', protect, allowedTo('admin'), updateOrderToDelivered);
router.post('/:cartid', protect, allowedTo('user'), createCashOrder);

router.use(protect, allowedTo('user'));

router.post('/checkoutSession/:cartid', createCheckoutSession);
module.exports= router;