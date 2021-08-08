const _gameContext = require('../Models/gameModel')
const _gameScoreService = require('./gameScoreServices')
const _groupMapServices = require('./GroupMapService')

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
            if(game !=null ){
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
        if(selected == 0){
            if(game.OnTurn >= game.Turns){
                //await this.UpdateGameOver(GameId)
                game.GameOver = true
                await _gameContext.findByIdAndUpdate(GameId , {
                    $set : game
                })
                return {Player:null , isGameOver : true}
            }
            game.OnTurn += 1
        } 
        await _gameContext.findByIdAndUpdate(GameId , {
            $set : game
        })
        return {Player : playerList[selected]._id, isGameOver :  false}
        
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

    IsGameOverAsync = async (GameId) =>{
        let result = await _gameContext.findById(GameId)
        return result.GameOver
    }

    GetGamePlayersAsync = async(GameId) =>{

        let Players  = await _gameScoreService.GetGameScoreByGameId(GameId)
        let GroupMaps = []
        for(let x of Players){
            let res =  await _groupMapServices.GetGroupByIdAsync(x.GroupMap)
            //console.log(res.UserId)
            let obj = {
                GameScoreId : x._id ,
                score:x.Score,
                User:res.UserId
            }
            GroupMaps.push(obj)
        }
        //console.log(GroupMaps)
        return GroupMaps
    }

    GetGamePlayerAsync = async(gMapId) =>{

        let result = await _groupMapServices.GetGroupByIdAsync(gMapId)
        //console.log(result.UserId)
        return result.UserId

    }

    //Manipulations

    CheckGameWordAsync = async(_id ,gameScoreId ,word,io) =>{
        let game = await this.GetGameByGameId(_id)
        console.log(gameScoreId,word)
        if( game.SelectedWord == word)
        {
            let result = await _gameScoreService.UpdateScoreAsync(20,gameScoreId)
            io.to(_id).emit("score" , {
                gameScoreId,
                score:20
            })
            //console.log(result)  
        }
    }    

}

module.exports = new gameServices();