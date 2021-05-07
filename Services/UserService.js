const _UserContext = require("../Models/UserModel")
const _JwtService = require('./JwtTokenService')
const bcrypt = require('bcrypt');

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


    LoginUserAsync = async(req) =>{
        let userName = req.body.Username
        let Password = req.body.Password
        try{
            const User = await _UserContext.findOne({Username : userName})
            if(User!=null)
            {
                const PasswordAuthResponse = await bcrypt.compare(Password , User.Password)
                if(PasswordAuthResponse){
                    // console.log("here")
                    let token  = await User.GenrateJwt()
                    return {
                        IsSuccess : true,
                        LoginSuccess:true, 
                        jwt : token
                    }
                }
            }
            else{
                
                return{
                    IsSuccess : true, 
                    LoginSuccess : false
                }

            }
            
        }
        catch(err){
            console.log(err)
            return{
                IsSuccess: false,
                Error : err,
                IsError : true
            }
        }
       


    }

    VerifyUser = (req) =>{
       return _JwtService.VerifyToken(req)    
    }

}

 
module.exports = new userServices();
