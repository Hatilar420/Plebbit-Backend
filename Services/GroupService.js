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



    //Exclusive Admin and Moderator operations



    //User,Admins and mod operations
}


module.exports = GroupService 