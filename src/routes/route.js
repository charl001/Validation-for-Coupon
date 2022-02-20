const express = require('express');

const router = express.Router();

const Coupon=require("../controllers/Coupon Controller")

router.post('/createCoupon',Coupon.createCoupon)
router.get('/getcoupon',Coupon.getcoupon)
router.get('/couponvalidation/:amount/:couponcode',Coupon.check)


module.exports = router;