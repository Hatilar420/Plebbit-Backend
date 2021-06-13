const _UserContext = require("../Models/UserModel")
const _JwtService = require('./JwtTokenService')
const bcrypt = require('bcrypt');
//const UserFileUpload = require('./UserFileSaveService')
const _postService = require('./PostService')
class userServices{

    constructor(){
        this._PostService =  new _postService(_UserContext)
    }

    AddUserAsync =  async(req,file) =>{

        let newUser = new  _UserContext(req)
    
        try {
            let result = await newUser.save();
            let token  = await newUser.GenrateJwt();
            //console.log(result)
            //console.log(file)
            if(file){
                //console.log(file)
                let FileSaveResult = await this.UploadUserAvatarUrlAsync(file,result._id)
                if(!FileSaveResult.IsSuccess){
                    return{
                        IsSuccess : false,
                        error : FileSaveResult.error
                    }
                }
            }
            console.log(result)
            return {
                jwt : token,
                IsSuccess : true
            }
        } catch (err) {
            //console.log(err)
            return {
                IsSuccess : false,
                error : err
            }
        }    
    }

    UploadUserAvatarUrlAsync = async(file,_id) =>{
        if(file){
            console.log(file.path)
            console.log(_id)
           let temp = await  _UserContext.findByIdAndUpdate(_id,{
                $set:{imageUrl:`/UserAvatars/${file.filename}`}
            })
            console.log(temp)
            return {
                IsSuccess : true
            }
        }
        return {
            IsSuccess : false,
            error: "Image was not present" 
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

    VerifyUserAndGetUserAsync = async (req) =>{
       var result = _JwtService.VerifyTokenAndGetId(req)
       if(result.IsSuccess){
            try {
              let user = await _UserContext.findById(result._id)
              return {IsSuccess : true , User  : user}                
            } catch (error) {
                return {IsSuccess : false , Error : error}
            }         
       }
       return result  
    }

    VerifyToken = async(req) =>{
        return _JwtService.VerifyTokenAndGetId(req)
    }

}

 
module.exports = new userServices();
