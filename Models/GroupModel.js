const mongoose  =  require('mongoose');
const {Schema} =  mongoose

let GroupSchema = new Schema({
    Name : {
        type: String,
        required : true
    },
    //Information of owner
    UserId : {
        type : Schema.Types.ObjectId,
        ref : "UserIdentity",
        required:true
    },
    TimeCreated : {
        default : Date.now()
    },
    Users : [{
        type : Schema.Types.ObjectId,
        ref : "GroupMap"
    }],
    Words : [{
        type:String
    }],
    Posts : [{
        type:Schema.Types.ObjectId,
        ref : "Post"
    }]
})

let groupModel =  mongoose.model("Group",userSchema);

module.exports = groupModel