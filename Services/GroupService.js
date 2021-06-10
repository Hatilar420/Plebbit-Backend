const PostService = require('./PostService')
const GroupContext = require('../Models/GroupModel') 
const _PostService = new PostService(GroupContext)
const _GroupMapService = require('./GroupMapService')

class GroupService {


    GetRoleOfUserAsync = async (_GroupId,_UserId) =>{
        let result = await _GroupMapService.GetGroupMapAsync(_UserId , _GroupId)
        if(result){
            return {IsSuccess : true , role : result.role}
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
        let Role =  await this.GetRoleOfUser(_GroupId,_OwnerId)
        if(role.IsSuccess){
            let role = Role.role
            if(role == "ADMIN" || role == "MOD"){
                let grp = await _PostService.GetPostbyIdAsync(_GroupId)
                grp.push(words)
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