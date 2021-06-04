
//This service can be used for Almost many models for CRUD operations
// With a UserId field in its schema

class PostService {
    //TO DO CRUD FIRST

    constructor(DbContext){
        this._PostContext = DbContext
    }
    //Read operations
    GetAllPostAsync =  async () =>{
        return await this._PostContext.find()
    }

    GetPostbyIdAsync = async (_id) =>{
            return await this._PostContext.findById(_id)
    }

    GetPostByUserId = async (_UserId) =>{
        return await this._PostContext.find({UserId:_UserId}) 
    }

    GetPostByGroupId = async (_GroupId) =>{
        return await this._PostContext.find({GroupId : _GroupId})
    }
    
    GetPostRepliesByPostIdAsync = async(_PostId) =>{
        return await this._PostContext.find({PostId:_PostId})
    }

    //Create operations
    CreatePostFromRequestAsync = async (req,_UserId) =>{
        req.UserId = _UserId
        let PostReq = this._PostContext(req)
        try {
            let result = await PostReq.save();
            console.log(result)
            return {IsSuccess : true,user : result}
        } catch (error) {
            console.log(error)
            return {IsSuccess : false , Error : error}
        }

    }

    CreatePostWithImageAsync = async (req,file,_UserId) =>{
        if(file){
            console.log(file.path)
            req.imageUrl = file.path
            return await this.CreatePostFromRequestAsync(req,_UserId)
        }
        return {IsSuccess:false , Errors : "Image was not present"}
    }

    /*UploadPostAsync = async(file,_id) =>{
        console.log("level2")
       if(file){
           console.log(file.path)
           console.log(_id)
          let temp = await  this._PostContext.findByIdAndUpdate(_id,{
               $set:{imageUrl:file.path}
           })
           console.log(temp)
           return {
               IsSuccess : true
           }
       }
       return {
           IsSuccess : false,
           error: "Image was not present" 
       }
   }*/


    //To Do Only Authorized user are able to update the post
    //Update operations
    UpdatePostAsync = async(req,id,UserId) =>{
        let PostId = id;
        //console.log(PostId)
        //One can easily Insert objects here
        /*let SetObj = {
            Title : req.Title, 
            Content : req.Content
        }*/ 
        //console.log(req)

        try {
            let post = await this.GetPostbyIdAsync(PostId)
            console.log(post)
            if(post != null)
            {
                console.log(post.UserId)
                console.log(UserId)
                if(post.UserId == UserId){
                    console.log("here")
                    await this._PostContext.findByIdAndUpdate(PostId,{
                        $set : req
                    })
                    return {IsSuccess : true}
                }
                else return {IsSuccess : false , Errors:"User Not Auth" , Code : 403 }
            }
            else{
                return {IsSuccess : false,Errors:"post not found"}
            }
            //console.log(result)
        } catch (error) {
            return {isSuccess : false,Errors : error}
        }
       
    }

    //DeleteOperations
    DeleteByIdAsync = async(_id,UserId) =>{
        try {
            let post = await this.GetPostbyIdAsync(_id)
            console.log(post)
            if(post != null){
                if(post.UserId == UserId){
                    let result = await this._PostContext.deleteOne({_id});
                    console.log(result)
                    return {IsSuccess : true}       
                }
                else return {IsSuccess : false , Errors:"User Not Auth" , Code : 403 }
            }
            else return {isSuccess : false , Errors : "post not found"}
        } catch (error) {

            return {isSuccess : false,Errors : error}
        }
        
    }        

}

module.exports = PostService
