const PostService = require('./PostService')
const GroupContext = require('../Models/GroupModel') 
const _PostService = new PostService(GroupContext)
const GroupMapService = require('./GroupMapService')

const _GroupMapService = new GroupMapService()

class GroupService {

    //Common Operations
    //Will be present in post service
    CreateGroupAsync = async (req,_UserId) =>{
        let CreateGroupResult = await _PostService.CreatePostFromRequestAsync(req,_UserId)
        if(CreateGroupResult.IsSuccess){
            let gid = result.user._id
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
        let MapResult = await _GroupMapService.CreateGroupMapAsync(_UserId,_GroupId,"USER")
        if(MapResult.IsSuccess){
            let groupResult = await _PostService.GetPostbyIdAsync(gid)
            return {IsSuccess : true,Group : groupResult}
        }else{
            return {IsSuccess : false , Error : MapResult.Error}
        }
    }
    

    //Exclusive Admin operations
    AssignRoleAsync = async (_OwnerId,_Gid,_UserId,_role) =>{
        let groupResult = await _PostService.GetPostbyIdAsync(_Gid)
        if(groupResult.IsSuccess){
            //If owner id is equal to userid then proceed to update
            if(_OwnerId == _UserId){
                let groupMap = await _GroupMapService.GetGroupMapAsync(_UserId,_Gid)
                console.log(groupMap)
                if(groupMap != null){
                    let gmapId = groupMap._id;
                    let obj ={
                        role : _role
                    }
                    let updateResult = await _GroupMapService.UpdateGroupMapAsync(gmapId,obj)
                    if(updateResult.IsSuccess){
                        return {IsSuccess : true , gmap : groupMap }
                    }else{
                        return updateResult
                    }                             

                }else{
                    return {IsSuccess : false , Error : "Map not found"}
                }
            }else{
                return {IsSuccess : false , StatusCode : 401 , Error : "User is not auth" }
            }
        }else
        {
            return groupResult
        }
    }


    //Exclusive Admin and Moderator operations


    //User,Admins and mod operations
}


module.exports = GroupService 