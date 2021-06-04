const GroupMapContext = require('../Models/GroupMapModel')

class GroupMapService {

    //CRUD Operations

    //Read operation

    GetGroupMapAsync = (_UserId,_GroupId) =>{
        let arr = await GroupMapContext.findOne({UserId:_UserId,GroupId:_GroupId})
        return arr[0]       
    }

    GetGroupByIdAsync = (gmapId) => {
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

}

module.exports = GroupMapService