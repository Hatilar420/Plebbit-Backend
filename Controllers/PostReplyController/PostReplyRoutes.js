const express =  require('express');
const router = express.Router();
const _UserService = require("../../Services/UserService.js")
const PostService = require("../../Services/PostService")
const PostAuthMiddleware =  require('../PostController/AuthMiddleware');
const PostReplyDbContext = require('../../Models/PostReplyModel')
//const { GetPostbyIdAsync } = require('../../Services/PostService');

router.use(PostAuthMiddleware)
const _PostReplyService = new PostService(PostReplyDbContext)

//POST ENDPOINTS

//Post should contain Key [PostId]
router.post("/",async (req,res) =>{
    let JwtDecodeResult = await _UserService.VerifyUserAndGetUserAsync(req)
    let userId =  JwtDecodeResult.User._id
    try{
        let result = await _PostReplyService.CreatePostFromRequestAsync(req.body,userId)
        console.log(result)
        if(result.IsSuccess){
            res.status(201).send({
                CreatedRoute : `reply/s/${result.user._id}`
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

router.get('/:Postid', async(req,res) =>{
    let GetPost = await _PostReplyService.GetPostRepliesByPostIdAsync(req.params.Postid)
    if(GetPost != null)
    {
        res.status(200).send(GetPost)
    }else{
        res.status(404).send()
    }
     
} )


router.get('/user',async (req,res) =>{
    let JwtDecodeResult = await _UserService.VerifyUserAndGetUserAsync(req)
    let userId =  JwtDecodeResult.User._id
    console.log(userId)
    let GetPosts = await _PostReplyService.GetPostByUserId(userId)
    console.log(GetPosts)
    if(GetPosts != null)
    {
        res.status(200).send(GetPosts)
    }else{
        res.statusCode(404).send()
    }
    //res.status(200).send();
})


// 's' here stands for single
router.get('/s/:id', async(req,res) =>{
    let GetPost = await _PostReplyService.GetPostbyIdAsync(req.params.id)
    if(GetPost != null)
    {
        res.status(200).send(GetPost)
    }else{
        res.status(404).send()
    }
     
} )

//Update Routes

router.put('/s/:id',async(req,res) =>{
    let postId = req.params.id
    let temp = {
        Content : req.body.Content
    }
    let result = await _PostReplyService.UpdatePostAsync(temp,postId)
    if(result.IsSuccess){
        res.status(200).send({
            Route : `reply/s/${postId}`
        })
    }else{
        res.status(400).send(result.Errors)
    }
})


//Delete Routes

router.delete('/s/:id',async(req,res) =>{
    let postId = req.params.id
    let result = await _PostReplyService.DeleteByIdAsync(postId)
    if(result.IsSuccess){
        res.status(200).send({
            Deleted : `reply/s/${postId}`
        })
    }else{
        res.status(400).send(result.Errors)
    }
})

module.exports = router


