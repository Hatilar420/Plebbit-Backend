const mongoose  =  require('mongoose');
const {Schema} =  mongoose


let GameScoreSchema = new Schema({
    //Linked with groups
    GameId :{
        type : Schema.Types.ObjectId,
        ref : "GameModel",
        required : true
    },
    GroupMap : {
        type : Schema.Types.ObjectId,
        ref : "GroupMap",
        required: true
    },
    Score : {
        type: Number,
        required:true
    },
    isOnline : {
        type : Boolean, 
        default:false
    }
})


let gameScoreModel =  mongoose.model("GameScoreModel",GameScoreSchema);

module.exports = gameScoreModel