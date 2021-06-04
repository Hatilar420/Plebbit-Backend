const mongoose  =  require('mongoose');
const {Schema} =  mongoose


let GroupMapSchema = new Schema({
    UserId : {
        type : Schema.Types.ObjectId,
        ref : "UserIdentity",
        required : true
    },
    role : {
        type : String,
        required : true 
    },
    //Linked with groups
    GroupId :{
        type : Schema.Types.ObjectId,
        ref : "Group",
        required : true
    }

})