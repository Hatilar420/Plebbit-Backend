const mongoose  =  require('mongoose');
const jwtService = require('../Services/JwtTokenService')
const bcrypt = require('bcrypt');
var uniqueValidator = require('mongoose-unique-validator');
const Emailvalidator = require("email-validator");
const {Schema} =  mongoose

let userSchema = new Schema({
    Username : {
        type : String,
        required : true,
        unique : true
    },
    Password : {
        type : String,
        required :true    
    },email:{
        type:String,
        required:true,
        unique:true,
        validate(value){
            if(!Emailvalidator.validate(value)){
                throw new Error("Email is not valid please check")
            }
        }
    }

})
userSchema.plugin(uniqueValidator)

userSchema.methods.GenrateJwt = async function(){
    let User = this
    try{
        let tokengen =  await jwtService.SignToken(User._id)
        return tokengen
    }catch(exp){
        console.log(exp)
    }
}

userSchema.pre("save", async function(next){
    const user = this
    if(user.isModified('Password')){
        //console.log(user.Password)
        user.Password = await bcrypt.hash(user.Password, 8)
    }
    next()
} )

let userModel =  mongoose.model("UserIdentity",userSchema);


module.exports =  userModel