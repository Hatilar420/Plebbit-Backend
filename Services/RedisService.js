const redis = require("redis");
const client = redis.createClient(6379);
const { promisify } = require('util');

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


const RegisterPeerId = (gid,playerId,peerId) =>{

    client.setex(`PeerId_${gid}_${playerId}` ,3600,peerId )

}

const GetPeerId = (gid,playerId , cb) =>{

    client.get( `PeerId_${gid}_${playerId}` , (error,data) =>{

        if(error || data == null){
            console.log(playerId,error)
            cb(null)
        }else{
            //console.log(playerId,data)
            cb(data)
        }

    } )
}

const GetPeerIdAsync = async (gid, playerId ) =>{

    const getAsync = promisify(client.get).bind(client);
    const value = await getAsync(`PeerId_${gid}_${playerId}`);
    //console.log(playerId,value)
    return value

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

const DeletePeerId = (gid,playerId) =>{
    try{
        DeleteKey(`PeerId_${gid}_${playerId}`)
    }catch(err){
        console.log(err)
    }
    
}

const DeleteKey = (key) =>{

    client.del(key)
}

module.exports = {IncrementCounter,GetCounterSeconds,RegisterPeerId,GetPeerId,GetPeerIdAsync,DeletePeerId}