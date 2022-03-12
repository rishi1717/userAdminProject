const express = require('express')
const res = require('express/lib/response')
const router = require('./router')

const app = express()

const port = process.env.port || 3001

app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.set('view engine', 'ejs')

app.get('/', (req,res)=>{
    res.render('login',{user:"Rishi"})
})

app.get('/admin',(req,res)=>{
    res.render('admin')
})

app.use('/route',router)

app.listen(port, (err)=>{
    if(err)
        console.log(err.message);
    else
        console.log(`Listening on http://localhost:${port}`);
})