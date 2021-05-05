const express =  require('express');
require('./Models/Dbcontext.js');
const app =  express();
const port = 8080;

app.listen(port , () => {
    console.log(`listening to port ${port}`)
})
