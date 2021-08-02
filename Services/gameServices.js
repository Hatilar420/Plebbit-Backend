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


    UpdateTurnAsync = async (GameId) =>{
        let playerList =  await _gameScoreService.GetGameScoreByGameId(GameId)
        let game  = await this.GetGameByGameId(GameId)
        let selected = (game.SelectedPlayer + 1) % (playerList.length)
        game.SelectedPlayer = selected
        await _gameContext.findByIdAndUpdate(GameId , {
            $set : game
        })
        return playerList[selected]._id
        
     }


     UpdateWordAsync = async (GameId,word) =>{
         try{
            let game  = await this.GetGameByGameId(GameId)
            game.SelectedWord = word
            await _gameContext.findByIdAndUpdate(GameId , {
                $set : game
            })
            return GameId
         }catch(error){
             console.log(error)
             return null
         }
     }
    
    //Get

    GetGameByGameId =  async (_id) =>{
        return await _gameContext.findById(_id)

    }

    GetGamesByGroupId = async (_gid) =>{

        return await _gameContext.find({GroupId : _gid })

    }

    GetPlayerTurn = async (GameId) =>{
        let playerList =  await _gameScoreService.GetGameScoreByGameId(GameId)
        let game  = await this.GetGameByGameId(GameId)
        return playerList[game.SelectedPlayer]._id
    }

    //Manipulations

    CheckGameWordAsync = async(_id ,gameScoreId ,word) =>{
        let game = await this.GetGameByGameId(_id)
        console.log(gameScoreId,word)
        if( game.SelectedWord == word)
        {
            let result = await _gameScoreService.UpdateScoreAsync(20,gameScoreId)
            console.log(result)  
        }
    }    

}

module.exports = new gameServices();