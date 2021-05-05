const mongoose  =  require('mongoose');
const jwtService = require('../Services/JwtTokenService')
const {Schema} =  mongoose

let userSchema = new Schema({
    Username : {
        type : String,
        require : true
    },
    Password : {
        type : String,
        require:true    
    }

})

userSchema.method.GenrateJwt = async function(){
    let User = this
    try{
        let tokengen =  await jwtService.SignToken(this._id)
        console.log(tokengen)
    }catch(exp){
        console.log(exp)
    }
}

userSchema.pre("save", async function(next){
    const user = this
    if(user.isModified('password')){
        console.log(user.password)
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
} )

let userModel =  mongoose.model("UserIdentity",userSchema);


module.exports =  userModel