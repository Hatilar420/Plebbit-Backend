require('dotenv').config()
const express =  require('express');
const { LoginUserAsync } = require('./Services/UserService');
require('./Models/Dbcontext.js');
const _UserService = require("./Services/UserService")
const app =  express();
const port = 8080;

app.use(express.json())

app.post('/user',async (req,res) =>{
    let result = await _UserService.AddUserAsync(req.body)
    if(result.IsSuccess)
    {
        res.status(201).send({
            jwt:result.jwt
        })
    }
    else{
        res.status(400).send({
            error : result.error
        })
    }
    
})

app.post('/login', async (req,res) =>{
   let innerRes = await LoginUserAsync(req)
   if(innerRes.IsSuccess && innerRes.LoginSuccess){
    res.status(200).send({jwt : innerRes.jwt});
   }else if(innerRes.IsSuccess && !innerRes.LoginSuccess){
       res.status(401).send(
           {message : "Username or password is incorrect"}
        )
   }else{
       res.status(500).send({
           message : innerRes.Error
       })
   }
   
})

app.listen(port , () => {
    console.log(`listening to port ${port}`)
})
