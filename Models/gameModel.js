const mongoose  =  require('mongoose');
const {Schema} =  mongoose


let GameModelSchema = new Schema({
    //Linked with groups
    GroupId :{
        type : Schema.Types.ObjectId,
        ref : "Group",
        required : true
    }
    ,
    GameOver:{
        type : Boolean
    },
    StartingTime:{
        type : Date,
        default : Date.now()
    },
    SelectedWord : {
        type : String,
        default : "temp"
    },
    SelectedPlayer : {
        type:Number, 
        default: 0
    }
})


let GameModel =  mongoose.model("GameModel",GameModelSchema);

module.exports = GameModel