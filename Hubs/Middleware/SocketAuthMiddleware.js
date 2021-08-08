const _UserService = require("../../Services/UserService")


const AuthJwt = async(socket,next) =>{
    let token = socket.handshake.auth.jwt
    //console.log("From Socket Auth middleware")
    //console.log(token)
    try {
            let result =  await _UserService.VerifyTokenAndGetUserFromToken(token)
        if(result.IsSuccess){
            next()
        }
        else{
            next(new Error("invalid jwt"))
        }
    } catch (error) {
        console.log("Error occured" , error)
    }
    
 }
 
 module.exports =  AuthJwt