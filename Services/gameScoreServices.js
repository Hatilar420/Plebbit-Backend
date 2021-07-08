const _gameScoreContext = require('../Models/gameScore')



class gameScoreServices {


    //Create

    CreateGameAsync = async  (req) =>{
        let chek = await this.GetGameScoreByGameAndGroupMap(req.GameId,req.GroupMap)
        if(chek != null){
            return {IsSuccess : true , Game : chek}
        }
        let gameScoreMake =  _gameScoreContext(req)
        try {
            let result = await gameScoreMake.save() 
            console.log(result)
            return {IsSuccess : true , Game : result}
        } catch (error) {
            console.log(error)
            return {IsSuccess : false , Error : error}
        }

    }

    //Update

    UpdateScoreAsync = async (score,_id) =>{

        try {
            let ScoreMod = await _gameScoreContext.findById(_id)
            if(ScoreMod){
                ScoreMod.Score += score
                await _gameScoreContext.findByIdAndUpdate(ScoreMod._id,{
                    $set : ScoreMod
                })
            }else{
                console.log("Score not found")
                return {IsSuccess : false}
            }
        } catch (error) {
            console.log(error)
            return {IsSuccess : false, Error : error}
        }

    }
    //Get

    GetGameScoreByid =  async (_id) =>{
        return await _gameScoreContext.findById(_id)

    }

    GetGameScoreByGameId = async (_gameId) =>{

        return await _gameScoreContext.find({GameId : _gameId })

    }

    GetGameScoreByGameAndGroupMap = async (_gameId , gMapId) =>{

        return await _gameScoreContext.findOne({GameId : _gameId  , GroupMap : gMapId})
    }

    GetGameScoreByGroupMapId = async (_gMapId) =>{

        return await _gameScoreContext.find({GroupMap : _gMapId })

    }

}

module.exports = new gameScoreServices();