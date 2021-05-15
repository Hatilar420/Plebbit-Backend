const express =  require('express');
const router = express.Router();
const _UserService = require("../../Services/UserService.js")
const _PostService = require("../../Services/PostService")
const PostAuthMiddleware =  require('./AuthMiddleware.js');
//const { GetPostbyIdAsync } = require('../../Services/PostService');

router.use(PostAuthMiddleware)

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

router.get('/:id', async(req,res) =>{
    let GetPost = await _PostService.GetPostbyIdAsync(req.params.id)
    if(GetPost != null)
    {
        res.status(200).send(GetPost)
    }else{
        res.status(404).send()
    }
     
} )

module.exports = router