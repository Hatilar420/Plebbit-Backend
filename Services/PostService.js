
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


    //Update operations
    UpdatePostAsync = async(req,id) =>{
        let PostId = id;
        //console.log(PostId)
        //One can easily Insert objects here
        /*let SetObj = {
            Title : req.Title, 
            Content : req.Content
        }*/ 
        //console.log(req)

        try {
            var result = await this._PostContext.findByIdAndUpdate(PostId,{
                $set : req
            })
            //console.log(result)
            return {IsSuccess : true}
        } catch (error) {
            return {isSuccess : false,Errors : error}
        }
       
    }

    //DeleteOperations
    DeleteByIdAsync = async(_id) =>{
        try {
            let result = await this._PostContext.deleteOne({_id});
            console.log(result)
            return {IsSuccess : true}
        } catch (error) {
            return {isSuccess : false,Errors : error}
        }
        
    }        

}

module.exports = PostService
