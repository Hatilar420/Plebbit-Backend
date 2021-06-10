const _GroupService = require('../../Services/GroupService')
const _UserService = require("../../Services/UserService.js")

const AuthReq = async (req,res,next) =>{
    let result =  await _UserService.VerifyUserAndGetUserAsync(req)
    let uid = result.User._id
    let gid = req.body.GroupId
    let tempResult = await _GroupService.GetRoleOfUserAsync(gid,uid)
    if(tempResult.IsSuccess){
        let role = tempResult.role
        if(role == "ADMIN" || role == "MOD"){
            next()
        }else{
            res.status(401).send()
        }
    }
    else{
        res.status(401).send()
    }
}

module.exports = AuthReq