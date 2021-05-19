const _UserService = require("../../Services/UserService.js")

const AuthJwt = async(req,res,next) =>{
   let result =  await _UserService.VerifyUserAndGetUserAsync(req)
   if(result.IsSuccess){
       //console.log(result)
       next()
   }
   else{
    console.log(result.error)
    res.status(401).send({
        message : "Jwt is not valid or user doesn't exist",
        error : result.Error 
    })
   }
}

module.exports =  AuthJwt