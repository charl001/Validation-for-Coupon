const mongoose=require('mongoose');

const CouponSchema=new mongoose.Schema({
Coupon_No :{type:String,required:true,unique:true},
type: {type:String,required:true},
value:{type:Number},
minamount:{type:Number},
percentoff:{type:Number},
maxdiscount:{type:Number},
startDate:{type:Date,default:Date.now()},
expiryDate:{type:Date,required:true},
Used:{type:Boolean,default:false}
})

module.exports=mongoose.model("CouponDB",CouponSchema)