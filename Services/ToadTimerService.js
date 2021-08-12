const { ToadScheduler, SimpleIntervalJob, Task } = require('toad-scheduler')
const {IncrementCounter,GetCounterSeconds}  = require("./RedisService.js")
const scheduler = new ToadScheduler()
const _gameService = require('./gameServices')


const SchedueleJob = (Socket , Gid) =>{

    const task = new Task(Gid,() =>{
        IncrementCounter(Gid ,60,async (counter) =>{
            if(counter == -1){
                scheduler.removeById(Gid)
                let result = await _gameService.UpdateTurnAsync(Gid)
                if(!result.isGameOver)
                {
                    //console.log("not over",result)
                    Socket.to(Gid).emit("turn" , {
                        Gameid : result.Player
                    })
                    WordSelectTImer(Socket,Gid)
                }
                else if(result.isGameOver){
                    //console.log("game over")
                    Socket.to(Gid).emit("GameOver" , {
                        Gameid : Gid
                    })
                }
            }

            Socket.to(Gid).emit("timer" ,{timeLeft:counter})
        })
    })
    const job  = new SimpleIntervalJob({ seconds:1 }, task,Gid)
    scheduler.addSimpleIntervalJob(job)
    return job


}

const WordSelectTImer = (Socket,gid) =>{
    const task = new Task(`Select_${gid}` , () =>{
        IncrementCounter(gid,20, async(counter) =>{

            if(counter == -1){
                scheduler.removeById(`Select_${gid}`)
                let result = await _gameService.UpdateTurnAsync(gid)
                if(!result.isGameOver)
                {
                    //console.log("not over",result)
                    Socket.to(gid).emit("turn" , {
                        Gameid : result.Player
                    })
                    WordSelectTImer(Socket,gid)
                }
                else if(result.isGameOver){
                    //console.log("game over")
                    Socket.to(gid).emit("GameOver" , {
                        Gameid : gid
                    })
                }
            }

            Socket.to(gid).emit("WordSelectTimer" ,{timeLeft:counter})

        })
    })

    const job  = new SimpleIntervalJob({ seconds:1 }, task,`Select_${gid}`)
    scheduler.addSimpleIntervalJob(job)
    return job
}


const StopJob = (SchedueleId) =>{
    try {
        console.log(`Stopped job with id ${SchedueleId}`)
        scheduler.removeById(SchedueleId)
    } catch (error) {
        console.log(error)
    }
}


module.exports = {SchedueleJob,StopJob}
