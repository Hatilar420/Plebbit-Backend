let jwt = require('jsonwebtoken');

class JwtToken {
    expiry = null;
    constructor(secret){
        this.Secret =  secret;
    }
    expiry(minutes){
        if(minutes != null && minutes > 0 ){
            this.expiry = Math.floor(Date.now()/1000) + (minutes * 60);
        }
        else{
            throw new Error("minutes are null or zero");
        }
    }

   async SignToken(id){
       let payload = {}
       if(id != null && id.toString().length > 0){
            payload._id = id.toString()
            if(this.expiry != null){
                payload.exp = expiry
            }
            let token =  await jwt.sign(payload,this.Secret);
            return token
       }
       return null
   } 

    VerifyTokenAndGetId(request){
        let AuthHeader  =  request.header('Authorization')
        let token = ""
        if(AuthHeader == null){
            return{
                IsSuccess : false,
                error:"Authorization header not present"
            }
        }else{
            token = AuthHeader.replace("Bearer " , "")
        }
        return this.VerifyTokenAndGetIdFromJwt(token)
   }

   VerifyTokenAndGetIdFromJwt(token){
    console.log("Token:" + token)
        try{
            let decoded = jwt.verify(token,this.Secret)
            console.log(decoded)
            return {IsSuccess : true , _id : decoded._id}
        }catch(err){
                return {IsSuccess : false , error : err }
        }

}

}

module.exports = new JwtToken(process.env.PRIVATE_KEY);
