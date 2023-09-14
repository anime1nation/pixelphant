import mongoose from "mongoose";
//schema for subscription
const subs = new mongoose.Schema({
    serviceID:{type:String,unique:true},
    serviceName:String,
    serviceLink:String,
    monthlyFee:String,
    startDate:Date,
    userID:String,
});
const subsSchema = mongoose.model('subscriptions', subs)

export {subsSchema}