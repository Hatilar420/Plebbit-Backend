const PostService = require('./PostService')
const GroupContext = require('../Models/GroupModel') 
const _PostService = new PostService(GroupContext)
const _GroupMapService = require('./GroupMapService')

class GroupService {

    GetGroupsByUserAsync = async(_UserId) =>{
        let result = await _GroupMapService.GetGroupMapByUserIdAsync(_UserId)
        return result
    }

    GetUsersByGidAsync = async (_gid) =>{
        let result = await _GroupMapService.GetGroupMapByGroupAsync(_gid)
        return result
    }

    GetRoleOfUserAsync = async (_GroupId,_UserId) =>{
        let result = await _GroupMapService.GetGroupMapAsync(_UserId , _GroupId)
        if(result){
            return {IsSuccess : true , role : result.role}
        }else{
            return {IsSuccess : false , Error:"Not found"}
        }
    }

    GetUserMapAsync = async (_GroupId,_UserId) =>{
        let result = await _GroupMapService.GetGroupMapAsync(_UserId , _GroupId)
        if(result){
            return {IsSuccess : true , map : result}
        }else{
            return {IsSuccess : false , Error:"Not found"}
        }
    }

    //Common Operations
    //Will be present in post service
    CreateGroupAsync = async (req,_UserId) =>{
        let CreateGroupResult = await _PostService.CreatePostFromRequestAsync(req,_UserId)
        if(CreateGroupResult.IsSuccess){
            let gid = CreateGroupResult.user._id
            let MapResult = await _GroupMapService.CreateGroupMapAsync(_UserId,gid,"ADMIN")
            if(MapResult.IsSuccess)
            {
                let groupResult = await _PostService.GetPostbyIdAsync(gid)
                return {IsSuccess : true,Group : groupResult}
            }
            else{
                return { IsSuccess : false , Error : MapResult.Error}
            }
        }else{
            return {IsSuccess : false ,  Error : CreateGroupResult.Error }
        }
    }

    JoinGroupAsync = async (_UserId,_GroupId) =>{
        try{
            let group = await _PostService.GetPostbyIdAsync(_GroupId)
            if(group == null) return {IsSuccess : false , StatusCode : 404 , Error : "Group Not found"}
            let MapResult = await _GroupMapService.CreateGroupMapAsync(_UserId,_GroupId,"USER")
            if(MapResult.IsSuccess){
                let groupResult = await _PostService.GetPostbyIdAsync(_GroupId)
                return {IsSuccess : true,Group : groupResult}
            }else{
                return MapResult
            }
        }catch(error){
            return {IsSuccess : false , StatusCode: 500 , Error : error}
        }
    }
    

    //Exclusive Admin operations
    AssignRoleAsync = async (_OwnerId,_Gid,_UserId,_role) =>{
        let groupResult = await _PostService.GetPostbyIdAsync(_Gid)
        if(groupResult != null){
                let groupMap = await _GroupMapService.GetGroupMapAsync(_UserId,_Gid)
                console.log(groupMap)
                if(groupMap != null){
                    let gmapId = groupMap._id;
                    groupMap.role = _role 
                    let updateResult = await _GroupMapService.UpdateGroupMapAsync(gmapId,groupMap)
                    if(updateResult.IsSuccess){
                        return {IsSuccess : true , gmap : groupMap }
                    }else{
                        return updateResult
                    }                             

                }else{
                    return {IsSuccess : false , Error : "Map not found"}
                }
        }else
        {
            return groupResult
        }
    }


    RemoveUserAsync = async (_OwnerId , _GroupId, _UserId ) =>{
        let groupResult = await _GroupMapService.GetGroupMapAsync(_OwnerId , _GroupId)
        if(groupResult.role == "ADMIN" || groupResult.role == "MOD"){
            let result  = await _GroupMapService.DeleteGroupMapAsync(_GroupId,_UserId)
            return result               

        }else
        {
            return {IsSuccess : false , Error : "UnAuthorized", StatusCode:401}
        }
    }

    AddWordsAsync = async(_OwnerId , _GroupId ,words ) =>{
        let Role =  await this.GetRoleOfUserAsync(_GroupId,_OwnerId)
        if(Role.IsSuccess){
            let role = Role.role
            if(role == "ADMIN" || role == "MOD"){
                let grp = await _PostService.GetPostbyIdAsync(_GroupId)
                for(let i of words) grp.Words.push(i)
                try{
                     await GroupContext.findByIdAndUpdate(_GroupId,{
                        $set : grp
                    })
                    return {IsSuccess : true}
                }catch(error){
                    return {IsSuccess : false , Error : error }
                }
            }
            else{
                return {IsSuccess : false , StatusCode : 401 , Error : "User not Authorized"}
            }
        }else{
            return Role
        }
    }

    //User,Admins and mod operations
}


module.exports = new GroupService() 