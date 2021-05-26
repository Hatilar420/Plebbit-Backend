require('dotenv').config()
const express =  require('express');
require('./Models/Dbcontext.js');
const RegisterLoginRoute = require('./Controllers/LogInAndRegister/LoginAndRegisterRoutes')
const PostRoute = require('./Controllers/PostController/PostRoutes')
const UserRoutes = require('./Controllers/UserController/userRoutes')
const PostReplyRoutes = require('./Controllers/PostReplyController/PostReplyRoutes')
const app =  express();
const port =  8080

app.use(express.static('uploads'))
app.use(express.json())
app.use(RegisterLoginRoute)
app.use("/post",PostRoute)
app.use('/user',UserRoutes)
app.use('/reply',PostReplyRoutes)


app.listen(port , () => {
    console.log(`listening to port ${port}`)
})
