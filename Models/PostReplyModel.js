const mongoose  =  require('mongoose');
const {Schema} =  mongoose

let PostReplySchema = new Schema({
    Content : {
        type : String,
        required :true    
    },
    UserId :{
        type : String,
        required : true
    },
    PostId:{
        type: String,
        required: true
    },
    CreationDate:{
        type : Date,
        default : Date.now()
    }    

})

let PostReplyModel =  mongoose.model("PostReply",PostReplySchema);

module.exports =  PostReplyModel