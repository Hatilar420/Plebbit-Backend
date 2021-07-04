const express =  require('express');
const router = express.Router();
const _UserService = require("../../Services/UserService.js")
const _PostService = require('../../Services/PostService')
const GroupDbContext = require('../../Models/GroupModel')
const _GroupPostService = new _PostService(GroupDbContext)
const _GroupService = require('../../Services/GroupService')
const _GroupMapService =  require('../../Services/GroupMapService')
const AuthMiddleware = require('../PostController/AuthMiddleware')
const RoleAuthMiddleware = require('./GroupRouteRoleCheck');
const { GetRoleOfUserAsync } = require('../../Services/GroupService');
const _gameService = require('../../Services/gameServices')

router.get('/ping', (req,res) =>{
    res.status(200).send("pong")
})


//The Middleware
router.use(AuthMiddleware)

//Get Operations

router.get('/',async (req,res) =>{
    let JwtDecodeResult = await _UserService.VerifyUserAndGetUserAsync(req)
    let userId =  JwtDecodeResult.User._id
    try{
        let result  = await _GroupService.GetGroupsByUserAsync(userId)
        if(result){
            res.status(200).send(result)
        }else{
            res.status(400).send()
        }
    }catch(error){
        res.status(500).send(error)
    }

})

router.get('/:id',async(req,res) =>{
    let Gid = req.params.id

    let group =  await _GroupPostService.GetPostbyIdAsync(Gid)

    res.status(200).send(group)

})

router.get('/users/:id' , async(req,res) =>{
    let Gid = req.params.id

    let result =  await _GroupService.GetUsersByGidAsync(Gid)
    
    res.status(200).send(result)

} )

router.get('/game/:gid',async(req,res) =>{
    _gid = req.params.gid
    let result = await _gameService.GetGamesByGroupId(_gid)
    if(result != null){
        res.status(200).send(result)
    }
    else{
        res.status(400).send("Group not found")
    }
})

//Implement Expire routes
//THIS IS TEMPORARY
router.get('/join/:gid',async(req,res) =>{
    let Gid = req.params.gid
    console.log(Gid)
    let JwtDecodeResult = await _UserService.VerifyUserAndGetUserAsync(req)
    let userId =  JwtDecodeResult.User._id
    let result = await _GroupService.JoinGroupAsync(userId,Gid)
    if(result.IsSuccess){
        res.status(200).send(result.Group)
    }
    else{
        if(result.StatusCode  == 403) {
            res.status(403).send('forbidden >_<')
            return
        }
        if(result.StatusCode == 500) {
            res.status(500).send(result.Error)
            return
        }
        if(result.StatusCode == 404) {res.status(404).send("Not Found")
        return}
        res.status(500).send(result.Error)
    }
})

//Create Operations

router.post('/',async (req,res) => {
    let JwtDecodeResult = await _UserService.VerifyUserAndGetUserAsync(req)
    let userId =  JwtDecodeResult.User._id
    try{
        let result = await _GroupService.CreateGroupAsync(req.body,userId)
        if(result.IsSuccess){
            res.status(201).send({
                route : `group/${result.Group._id}`
            })
    }
    }catch(error){
        console.log(error)
        res.status(500).send(error)
    }
})

router.post('/game' , async(req,res) =>{
    let body = {
        GameOver:false,
        GroupId : req.body.GroupId
    }
    try {
        let result = await _gameService.CreateGameAsync(body)
        if(result.IsSuccess){
            res.status(200).send(result.Game._id)
        }else{
            console.log("")
            res.status(400).send("Bad request")
        }
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }


})

router.post('/role/assign',RoleAuthMiddleware,async (req,res) =>{

    let JwtDecodeResult = await _UserService.VerifyUserAndGetUserAsync(req)
    let oId =  JwtDecodeResult.User._id
    let gid = req.body.GroupId
    let uid = req.body.Id
    let role = req.body.Role
    let result = await _GroupService.AssignRoleAsync(oId,gid,uid,role)
    if(result.IsSuccess){
        res.status(200).send()
    }else{
        if(result.StatusCode) res.status(401).send(result.Error)
        res.status(500).send(result)
    }
    

})

router.post('/user/kick',RoleAuthMiddleware,async (req,res) =>{
    let JwtDecodeResult = await _UserService.VerifyUserAndGetUserAsync(req)
    let oId =  JwtDecodeResult.User._id
    let gid = req.body.GroupId
    let uid = req.body.Id
    let result = await _GroupService.RemoveUserAsync(oId,gid,uid)
    if(result.IsSuccess){
        res.status(200).send()
    }else{
        res.status(401).send('UnAuthorized')
    }
})


router.post('/word/add' , RoleAuthMiddleware ,async (req , res)=>{
    let JwtDecodeResult = await _UserService.VerifyUserAndGetUserAsync(req)
    let oId =  JwtDecodeResult.User._id
    let gid = req.body.GroupId
    let words = req.body.words
    let result = await _GroupService.AddWordsAsync(oId,gid,words)
    if(result.IsSuccess){
        res.status(200).send('ok :)')
    }
    else{
        if(result.StatusCode) res.status(403).send('forbidden >_<')
        res.status(500).send(result.Error)
    }

})



module.exports = router