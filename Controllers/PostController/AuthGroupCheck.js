const GroupMapService = require('../../Services/GroupMapService')
const _UserService = require("../../Services/UserService.js")

const AuthReq = async (req,res,next) =>{
    let result =  await _UserService.VerifyUserAndGetUserAsync(req)
    let uid = result.User._id
    //console.log(uid)
    let gid = req.body.GroupId
    //console.log(gid)
    let temp = await GroupMapService.GetGroupMapAsync(uid , gid)
    if(temp == null) res.status(401).send("wrong group")
    else{
        next()
    }
}

module.exports = AuthReq