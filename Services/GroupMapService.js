const GroupMapContext = require('../Models/GroupMapModel')
const GroupContext = require('../Models/GroupModel')

class GroupMapService {

    //CRUD Operations

    //Read operation

    GetGroupMapAsync = async (_UserId,_GroupId) =>{
        let arr = await GroupMapContext.findOne({UserId:_UserId,GroupId:_GroupId})
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
        let req = GroupMapContext(obj)
        try{
            let result = await req.save()
            console.log(result)
            return {IsSuccess : true, GroupMap : result }
        }catch(error){
                return {IsSuccess : false , Error :error}
        }
    }

    UpdateGroupMapAsync = async (_GroupMapId , req) =>{
            try {
                GroupMapContext.findByIdAndUpdate(_GroupMapId,{
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