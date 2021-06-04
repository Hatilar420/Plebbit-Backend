const GroupMapContext = require('../Models/GroupMapModel')

class GroupMapService {

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

}

module.exports = GroupMapService