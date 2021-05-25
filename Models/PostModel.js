const mongoose  =  require('mongoose');
const {Schema} =  mongoose

let PostSchema = new Schema({
    Title : {
        type : String,
        required : true,
        //unique : true
    },
    Content : {
        type : String,
        required :true    
    },
    UserId :{
        type : String,
        required : true
    },
    CreationDate:{
        type : Date,
        default : Date.now()
    },imageUrl:{
        type:String
    }    

})

let PostModel =  mongoose.model("Post",PostSchema);

module.exports =  PostModel
