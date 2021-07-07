const _gameContext = require('../Models/gameModel')
const _gameScoreService = require('./gameScoreServices')

class gameServices {

    //Create

    CreateGameAsync = async  (req) =>{

        let gameMake =  _gameContext(req)
        try {
            let result = await gameMake.save() 
            console.log(result)
            return {IsSuccess : true , Game : result}
        } catch (error) {
            console.log(error)
            return {IsSuccess : false , Error : error}
        }

    }

    //Update

    UpdateGameOver = async(gameId)=>{
        try{
            let game  = await this.GetGamesByGameId(gameId)
            if(game !=null){
                game.GameOver = true
            }
            else {
                return {IsSuccess : false}
            }
            await _gameContext.findByIdAndUpdate(gameId,{
               $set : game
           })
           return {IsSuccess : true}
       }catch(error){
           return {IsSuccess : false , Error : error }
       }
    }
    
    //Get

    GetGameByGameId =  async (_id) =>{
        return await _gameContext.findById(_id)

    }

    GetGamesByGroupId = async (_gid) =>{

        return await _gameContext.find({GroupId : _gid })

    }

    //Manipulations

    CheckGameWordAsync = async(_id , word) =>{
        let game = await this.GetGameByGameId(_id)
        return game.SelectedWord == word  
    }

}

module.exports = new gameServices();