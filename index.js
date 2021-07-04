require('dotenv').config()
const express =  require('express');
require('./Models/Dbcontext.js');
const RegisterLoginRoute = require('./Controllers/LogInAndRegister/LoginAndRegisterRoutes')
const PostRoute = require('./Controllers/PostController/PostRoutes')
const UserRoutes = require('./Controllers/UserController/userRoutes')
const PostReplyRoutes = require('./Controllers/PostReplyController/PostReplyRoutes')
const GroupRoutes = require('./Controllers/GroupControllers/GroupRoutes')
const app =  express();
const cors = require('cors')
const port =  8080
const httpServer = require("http").createServer(app)
const SocketAuth = require('./Hubs/Middleware/SocketAuthMiddleware')
const io = require('socket.io')(httpServer,{
    cors: {
      origin: "http://localhost:3000",
    },
  })

app.use(cors())
app.use(express.static('uploads'))
app.use(express.json())
app.use(RegisterLoginRoute)
app.use("/post",PostRoute)
app.use('/user',UserRoutes)
app.use('/reply',PostReplyRoutes)
app.use('/group',GroupRoutes)

io.use(SocketAuth)

io.on("connection" , (socket) =>{
    console.log("connected" ,socket.id)
    //io.emit("Loda","teri maa ki chut")
})

httpServer.listen(port , () =>{
  console.log("Hosted on "+port)
})
