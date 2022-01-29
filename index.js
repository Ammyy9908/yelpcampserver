const express = require('express')
const cors = require('cors')
const auth_routes = require('./routes/auth')
const api_routes = require('./routes/api')
const mongoose = require('mongoose')



// connection to database

mongoose.connect(`mongodb+srv://Sumit:2146255sb8@cluster0.0wij2.mongodb.net/yelpcamp`).then(()=>{
    console.log('connected to database')
}).catch((e)=>{
    console.log('error connecting to database')
})
const app = express()

app.use(cors())

app.use(express.json())

app.use('/auth',auth_routes)
app.use('/api',api_routes)
app.get('/',(req,res)=>{
    res.send('API is running')
})

const port = process.env.PORT || 5000;

app.listen(port,()=>{
    console.log(`SERVER LISTENING ON ${port}`);
})