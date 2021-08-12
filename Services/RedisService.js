const redis = require("redis");
const client = redis.createClient(6379);

client.on("error" , (error) =>{
    console.log(error)
})

const IncrementCounter = (Gid,EndTime,cb) =>{

    client.get(Gid , (error , data) =>{

        if(error || data === null){

            if(error){
                console.log(error)
            }
            //console.log(Gid)
            client.setex(Gid , 30 , 1)
            //console.log("Created New Key")
            cb(1)
            //return 1
        }
        else if(data >= EndTime){
            client.DEL(Gid)
            //console.log("Clock finished",data)
            cb(-1)
            //return -1
        }
        else{
            let temp = parseInt(data)+1
            client.setex(Gid,30,temp)
            //console.log("Increment",data)
            cb(temp)
            //return temp
        }

    })

}


const GetCounterSeconds = (gid) =>{
    let Data = null
    client.get(gid, (error,data) =>{

        if(error || data == null){
            data = null
        }else{
            Data = data   
        }

    })
    return data
}

module.exports = {IncrementCounter,GetCounterSeconds}