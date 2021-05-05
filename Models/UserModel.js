const mongoose  =  require('mongoose');
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

let userModel =  mongoose.model("UserIdentity",userSchema);


module.exports =  userModel