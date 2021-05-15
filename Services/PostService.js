const _PostContext = require("../Models/PostModel.js")
const _JwtService = require('./JwtTokenService')

class PostService {
    //TO DO CRUD FIRST


    //Read operations
    GetAllPostAsync =  async () =>{
        return await _PostContext.find()
    }

    GetPostbyIdAsync = async (_id) =>{
            return await _PostContext.findById(_id)
    }

    GetPostByUserId = async (_UserId) =>{
        return await _PostContext.findOne({UserId:_UserId}) 
    }    

    //Create operations
    CreatePostFromRequestAsync = async (req,_UserId) =>{
        req.UserId = _UserId
        let PostReq = _PostContext(req)
        try {
            let result = await PostReq.save();
            console.log(result)
            return {IsSuccess : true,user : result}
        } catch (error) {
            console.log(error)
            return {IsSuccess : false , Error : error}
        }

    }


    //Update operations
    UpdatePostAsync = async(req) =>{
        let PostId = req._id;

        //One can easily Insert objects here
        let SetObj = {
            Title : req.Title, 
            Content : req.Content
        } 

        try {
            var result = await _PostContext.findByIdAndUpdate(PostId,{
                $set : SetObj
            })
            console.log(result)
            return {IsSuccess : true}
        } catch (error) {
            return {isSuccess : false,Errors : error}
        }
       
    }

    //DeleteOperations
    DeletePostByIdAsync = async(_id) =>{
        try {
            let result = await _PostContext.deleteOne({_id});
            console.log(result)
            return {IsSuccess : true}
        } catch (error) {
            return {isSuccess : false,Errors : error}
        }
        
    }        

}

module.exports = new PostService()
