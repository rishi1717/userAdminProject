const express= require('express')
const mongoose = require('mongoose')

const router = express.Router()

router.post('/login',(req,res)=>{
    res.send('got login')
})

router.get('/register',(req,res)=>{
    res.render('register')
})

router.post('/register', (req,res)=>{
    res.send('got register')
})

router.get('/home',(req,res)=>{
    res.render('home',{user:"Rishi"})
})

router.post('/admin',(req,res)=>{
    console.log(req.body);
    res.render('adminPanel',{admin:"Rishi"})
})

 module.exports = router