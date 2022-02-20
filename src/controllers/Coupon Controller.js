const CouponModel=require("../models/Coupon Model")



const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}

const isValidCoupontype = function (type) {
    return ['Flat','Percent'].indexOf(type) !== -1
}

const createCoupon=async (req,res)=>
{
    let requestbody=req.body;
    if(!requestbody){
        res.status(400).send({status:false,message:"Please provide details for Coupon"})
    }

    let {Coupon_No,type,value,percentoff,minamount,maxdiscount,expiryDate}=requestbody;

   if(!isValid(Coupon_No)){
    return res.status(400).send({ status: false, message: 'Valid Coupon is required' })
   }

   const CouponDuplicate=await CouponModel.findOne({Coupon_No});
   if(CouponDuplicate){
       return res.status(400).send({status:false,message:"Please provide another coupon Number"})
   }
   if(!isValid(type)){
       return res.status(400).send({status:false,message:"Please provide Coupon type"})
   }
   type=type.trim();
   if(!isValidCoupontype(type)){
    return res.status(400).send({status:false,message:"Type shoul be among Flat or Percent"})
   }
   if(type=="Flat"){
      if(!isValid(value)){
        return res.status(400).send({status:false,message:"value is required"})
      }
   }else{
       if(!isValid(percentoff)){
        return res.status(400).send({status:false,message:"Percentage is required"})
       }}

   const regex=/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/
   if(!regex.test(expiryDate))
   {
       return res.status(400).send({status:false,message:"Date format is not correct."})
   }

   let CouponData={Coupon_No,type,value,percentoff,minamount,maxdiscount,expiryDate};
   let CouponN=await CouponModel.create(CouponData);
   res.status(201).send({status:true,data:CouponN})


}

const getcoupon=async (req,res)=>{
 

    let list=await CouponModel.find();
    return res.status(200).send({Coupon_List:list})
}


const check =async (req,res)=>{
    try{

    let CartAmount=req.params.amount;
    let CouponCode=req.params.couponcode;

    let checkCoupon=await CouponModel.findOne({Coupon_No:CouponCode});
    if(!checkCoupon){
        res.status(404).send({status:true,message:"Coupon Code is not correct."})
    }
    if(checkCoupon.Used=="false"){
        res.status(400).send({status:false,message:"Coupon Code is already used"})
    }
    let currentdate=Date.now();
    // console.log(currentdate)
    // console.log(checkCoupon.expiryDate)
    // const date1=new Date(checkCoupon.expiryDate)
    if(!(checkCoupon.expiryDate>currentdate)){
        res.status(400).send({status:false,message:"Coupon Code is expired."})
    }
    if(!(checkCoupon.minamount<CartAmount)){
        res.status(400).send({status:false,message:`Minimum amount of cart should be greater than ${checkCoupon.minamount}`})
    }

    if(checkCoupon.type=='Flat'){
        return res.status(200).send({status:true,message:`You are eligible for discount=${checkCoupon.value}`})
    }else{
        let percent=checkCoupon.percentoff;
        let discount=(percent*CartAmount)/100;
        if(discount>checkCoupon.maxdiscount) discount=checkCoupon.maxdiscount
        return res.status(200).send({status:true,message:`You are eligible for discount=${discount}`})
    }
}catch(err){
    return res.status(500).send({status:false,message:err.message})
}


}

module.exports={createCoupon,getcoupon,check}