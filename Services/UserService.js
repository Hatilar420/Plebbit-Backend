const _UserContext = require("../Models/UserModel")
const _JwtService = require('./JwtTokenService')

class userServices{

    AddUserAsync =  async(req) =>{

        let newUser = new  _UserContext(req)
    
        try {
            let result = await newUser.save();
            let token  = await newUser.GenrateJwt();
            console.log(result)
            return {
                jwt : token,
                IsSuccess : true
            }
        } catch (err) {
            console.log(err)
            return {
                IsSuccess : false,
                error : err
            }
        }
    
    
    }

}

 
module.exports = new userServices();
