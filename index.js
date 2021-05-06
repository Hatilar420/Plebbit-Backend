require('dotenv').config()
const express =  require('express');
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

app.listen(port , () => {
    console.log(`listening to port ${port}`)
})
