const express = require('express');
const router = express.Router();
const { createOrder, createSubscription, verifyWebhookSignature, handleWebhook, cancelSubscription } = require('../controllers/paypalController');

router.post('/create-order', createOrder);
router.post('/create-subscription', createSubscription);
router.post('/cancel-subscription', cancelSubscription);
router.post('/webhook', verifyWebhookSignature, handleWebhook);

module.exports = router;

