import mongoose from "mongoose";
//schema for user
const userSchema = new mongoose.Schema({
    userID:{type:String,unique:true},
    username:String,
    email:String,
    password:String
});
const User = mongoose.model('users',userSchema)
export { User }