const express =  require('express');
const router = express.Router();
const _UserService = require('../../Services/UserService.js')

router.post('/register',async (req,res) =>{
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

router.post('/login', async (req,res) =>{
   let innerRes = await _UserService.LoginUserAsync(req)
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

module.exports = router