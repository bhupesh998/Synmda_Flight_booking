
const express = require('express')
const app=express()

const indexRouter = require('./routes/index')

const port = process.env.port || 3000

app.use(express.json())

app.use("/", indexRouter)

app.listen(port, ()=>{
    console.log("Server Listing On Port=========>", port);  
})


module.exports = app