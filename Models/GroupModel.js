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
        type:Date,
        default : Date.now()
    },
    Words : [{
        type:String
    }]
})

let groupModel =  mongoose.model("Group",GroupSchema);

module.exports = groupModel