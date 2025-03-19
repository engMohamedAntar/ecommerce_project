//orderRoute.js
const express= require('express');
const {createCashOrder, getAllOrders, getSingleOrder, updateOrderToPaid, updateOrderToDelivered, filterOrders, createCheckoutSession}= require('../services/orderService');
const {protect, allowedTo}= require('../services/authService');

const router= express.Router();

router.get('/', protect, allowedTo('admin', 'user'), filterOrders, getAllOrders);
router.get('/:id', protect, allowedTo('admin', 'user'), getSingleOrder);
router.put('/:id/pay', protect, allowedTo('admin'), updateOrderToPaid);
router.put('/:id/deliver', protect, allowedTo('admin'), updateOrderToDelivered);

router.use(protect, allowedTo('user'));

router.post('/:cartid', createCashOrder);
router.post('/:cartid/checkout_session', createCheckoutSession);
module.exports= router;