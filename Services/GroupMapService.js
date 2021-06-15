const GroupMapContext = require('../Models/GroupMapModel')
const GroupContext = require('../Models/GroupModel')

class GroupMapService {

    //CRUD Operations

    //Read operation

    GetGroupMapAsync = async (_UserId,_GroupId) =>{
        let arr = await GroupMapContext.findOne({UserId:_UserId,GroupId:_GroupId})
        return arr       
    }

    GetGroupMapByUserIdAsync = async (_UserId) =>{
        let arr = await GroupMapContext.find({UserId : _UserId}).populate("GroupId")
        return arr
    }

    GetGroupMapByGroupAsync = async (_gid) =>{
        let arr = await GroupMapContext.find({GroupId : _gid}).populate("UserId")
        return arr
    }

    GetGroupByIdAsync = async (gmapId) => {
        return await GroupMapContext.findById(gmapId)
    }

    CreateGroupMapAsync = async(_UserId,_GroupId,Role) =>{
        let obj = {
            UserId : _UserId,
            GroupId : _GroupId,
            role : Role
        }
        let existMap = await this.GetGroupMapAsync(_UserId,_GroupId)
        if(existMap != null) return {IsSuccess:false , StatusCode:"403" ,Error:"Already exists"}
        let req = GroupMapContext(obj)
        try{
            let result = await req.save()
            console.log(result)
            return {IsSuccess : true, GroupMap : result }
        }catch(error){
                return {IsSuccess : false ,StatusCode:"500" ,Error :error}
        }
    }

    UpdateGroupMapAsync = async (_GroupMapId , req) =>{
            try {
                await GroupMapContext.findByIdAndUpdate(_GroupMapId,{
                    $set : req 
                })
                return {IsSuccess : true}
            }catch(error){
                return {IsSuccess : false,Error:error}
            }
    }

    DeleteGroupMapAsync = async (Gid,_UserId) =>{
        let gmap =  await this.GetGroupMapAsync(_UserId,Gid)
        try{
            if(gmap){
                let _id = gmap._id
                let result = await GroupMapContext.deleteOne({_id})
                console.log(result)
                return {IsSuccess : true}
            }else{
              return {IsSuccess : false , Error: "Map not found"}   
            } 
        }catch(error){
            return {IsSuccess : false , Error : error}
        }        
    }

}

module.exports = new  GroupMapService()