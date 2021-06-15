const express =  require('express');
const router = express.Router();
const _UserService = require('../../Services/UserService.js')
const PostAuthMiddleware =  require('../PostController/AuthMiddleware');

//Get the middleware
router.use(PostAuthMiddleware)


//GET ENDPOINTS


router.get('/',async (req,res) =>{
    let JwtDecodeResult = await _UserService.VerifyUserAndGetUserAsync(req)

    if(JwtDecodeResult.IsSuccess)
    {
        let tempUser = {
            _id : JwtDecodeResult.User._id,
            Username : JwtDecodeResult.User.Username,
            email : JwtDecodeResult.User.email,
            Avatar: JwtDecodeResult.User.imageUrl
        }
        res.status(200).send(tempUser)
    }else{
        res.statusCode(404).send()
    }
    //res.status(200).send();
})

router.get('/:id', async (req, res) =>{
    let user  = await _UserService.findUserByIdAsync(req.params.id)
    if(user != null){
        let tempUser = {
            _id : user._id,
            Username : user.Username,
            email : user.email,
            Avatar: user.imageUrl
        }
        res.status(200).send(tempUser)
    }else{
        res.status(400).send()
    }
})

//Update Endpoints

router.put('/',async (req,res) =>{
    let JwtDecodeResult = await _UserService.VerifyUserAndGetUserAsync(req)

    if(JwtDecodeResult.IsSuccess)
    {
        let tempUser = {
            _id : JwtDecodeResult.User._id,
            Username : JwtDecodeResult.User.Username,
            email : JwtDecodeResult.User.email,
            Avatar: JwtDecodeResult.User.imageUrl
        }
        res.status(200).send(tempUser)
    }else{
        res.statusCode(404).send()
    }
    //res.status(200).send();
})


module.exports = router

