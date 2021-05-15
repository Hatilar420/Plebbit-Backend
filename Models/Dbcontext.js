const mongoose  =  require('mongoose');
require('./UserModel')
mongoose.connect("mongodb://127.0.0.1:27017/Plebbit",
{useNewUrlParser: true, useUnifiedTopology: true,useCreateIndex :true}).then((result) => {
    console.log("Success")
}).catch((err) => {
    console.log(err)
});
