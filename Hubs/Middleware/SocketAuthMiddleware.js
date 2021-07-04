const _UserService = require("../../Services/UserService")


const AuthJwt = async(socket,next) =>{
    let token = socket.handshake.auth.jwt
    console.log("From Socket Auth middleware")
    console.log(token)
    let result =  await _UserService.VerifyTokenAndGetUserFromToken(token)
    if(result.IsSuccess){
        next()
    }
    else{
        next(new Error("invalid jwt"))
    }
 }
 
 module.exports =  AuthJwt