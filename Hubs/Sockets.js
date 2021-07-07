const _gameScoreServices  = require('../Services/gameScoreServices')
const _gameService = require('../Services/gameServices')

const SocketHub = (socket,io) =>{


    socket.on("join" , async({roomId,userMap}) =>{
        console.log(roomId)
        console.log(userMap)
        socket.join(roomId)
        let obj = {
          GameId : roomId,
          GroupMap : userMap,
          Score : 0
        }
        let result = await _gameScoreServices.CreateGameAsync(obj)
        io.to(roomId).emit("Joined",result.Game)
      })

      socket.on("grp" , async ({gid , message}) =>{
        console.log(message.Text,gid)
        //also get GroupMap

        if(await _gameService.CheckGameWordAsync(gid,message.Text)){
          console.log("Nice")
        }
        io.to(gid).emit("message" , {message})
      })


      socket.on("painting" , ({gid,data}) =>{
          socket.to(gid).emit("canvasData" ,{data})
      })
}

module.exports = SocketHub 


