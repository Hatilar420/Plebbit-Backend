const express =  require('express');
const router = express.Router();
const _UserService = require("../../Services/UserService.js")
const PostService = require("../../Services/PostService")
const PostAuthMiddleware =  require('./AuthMiddleware.js');
const PostDbContext = require('../../Models/PostModel.js')
//const { GetPostbyIdAsync } = require('../../Services/PostService');

router.use(PostAuthMiddleware)
const _PostService = new PostService(PostDbContext)


//POST ENDPOINTS

router.post("/",async (req,res) =>{
    let JwtDecodeResult = await _UserService.VerifyUserAndGetUserAsync(req)
    let userId =  JwtDecodeResult.User._id
    try{
        let result = await _PostService.CreatePostFromRequestAsync(req.body,userId)
        console.log(result)
        if(result.IsSuccess){
            res.status(201).send({
                CreatedRoute : `post/${result.user._id}`
            })
        }
        else{
            res.status(400).send({
                error : result.Error
            })
        }
    }catch(err){
            console.log(err)
            res.status(500).send({
                error : err  
            })
    }

})

//GET ENDPOINTS

router.get('/user',async (req,res) =>{
    let JwtDecodeResult = await _UserService.VerifyUserAndGetUserAsync(req)
    let userId =  JwtDecodeResult.User._id
    console.log(userId)
    let GetPosts = await _PostService.GetPostByUserId(userId)
    console.log(GetPosts)
    if(GetPosts != null)
    {
        res.status(200).send(GetPosts)
    }else{
        res.statusCode(404).send()
    }
    //res.status(200).send();
})

router.get('/:id', async(req,res) =>{
    let GetPost = await _PostService.GetPostbyIdAsync(req.params.id)
    if(GetPost != null)
    {
        res.status(200).send(GetPost)
    }else{
        res.status(404).send()
    }
     
} )

router.get('/',async (req,res) =>{
    let GetPosts = await _PostService.GetAllPostAsync()
    if(GetPosts != null)
    {
        res.status(200).send(GetPosts)
    }else{
        res.status(404).send()
    }
})


//UPDATE ENPOINTS

router.put('/:id',async(req,res) =>{
    let postId = req.params.id
    let result = await _PostService.UpdatePostAsync(req.body,postId)
    if(result.IsSuccess){
        res.status(200).send({
            Route : `post/${postId}`
        })
    }else{
        res.status(400).send(result.Errors)
    }
    /*console.log(postId)
    res.status(200).send()*/
})

//Delete ENDPOINTS

router.delete('/:id',async(req,res) =>{
    let postId = req.params.id
    let result = await _PostService.DeleteByIdAsync(postId)
    if(result.IsSuccess){
        res.status(200).send({
            Deleted : `post/${postId}`
        })
    }else{
        res.status(400).send(result.Errors)
    }
    /*console.log(postId)
    res.status(200).send()*/
})



module.exports = router