const _gameScoreServices  = require('../Services/gameScoreServices')
const _gameService = require('../Services/gameServices')

const SocketHub = (socket,io) =>{

    //gid is roomId
    socket.on("join" , async({roomId,userMap}) =>{
        //console.log(roomId)
        //console.log(userMap)
        socket.join(roomId)
        let obj = {
          GameId : roomId,
          GroupMap : userMap,
          Score : 0
        }
        let result = await _gameScoreServices.CreateGameAsync(obj)
        io.to(socket.id).emit("GameId" , result.Game)
        io.to(socket.id).emit("turn" , {
          Gameid : await  _gameService.GetPlayerTurn(roomId)
        })
        io.to(roomId).emit("Joined")
      })


      socket.on("TimerUpdate" , ({Gid,timeLeft}) =>{
          socket.to(Gid).emit("timer" ,{timeLeft})
      })

      socket.on("grp" , async ({gid , message,GameScoreId}) =>{
        await _gameService.CheckGameWordAsync(gid,GameScoreId._id,message.Text)
        io.to(gid).emit("message" , {message})
      })

      socket.on("updateTurn" , async ({GameID}) =>{
          let result = await _gameService.UpdateTurnAsync(GameID)
          io.to(GameID).emit("turn" , {
            Gameid : result
          })
      })

      socket.on("painting" , ({gid,data}) =>{
          socket.to(gid).emit("canvasData" ,{data})
      })

      socket.on("UpdateWord", async ({gid,word}) =>{
          let result = await _gameService.UpdateWordAsync(gid,word)
          if(result !=  null){
            socket.to(gid).emit("WordUpdate" , {word})
          }
      } )
}

module.exports = SocketHub 


