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

}

module.exports = new JwtToken(process.env.PRIVATE_KEY);
