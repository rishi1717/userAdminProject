const express= require('express')
const mongoose = require('mongoose')
const app=express()

const router = express.Router()

const userModel = require('./model/user.model')
const blogModel = require('./model/blog.model')
const adminModel = require('./model/admin.model')


router.post('/login',async (req,res)=>{
    let userFound = await userModel.findOne({userName:req.body.user, password:req.body.password})
    if(userFound){
        req.session.user = req.body.user
        res.redirect('home')
    }
    else 
        res.render('login',{error:'Wrong credentials!'})
})

router.get('/home',(req,res)=>{
    if(req.session.user){
        blogModel.find((err,blogs)=>{
            if(err)
                console.log(err.message)
            else{
                len = blogs.length
                res.render('home',{user: req.session.user, blogs: blogs, len: len})
            }
                
        })
        
    }
        
    else
        res.render('unauthorized')
})

router.get('/register',(req,res)=>{
    res.render('register')
})

router.get('/logout',(req,res)=>{
    req.session.destroy()
    res.redirect('/')
})

router.post('/register', (req,res)=>{
    console.log(req.body);
    userModel.insertMany([{userName: req.body.user, name:req.body.name, password: req.body.password, email: req.body.email}])
    res.redirect('/')
    
})

router.post('/admin',async (req,res)=>{
    let adminFound = await adminModel.findOne({admin:req.body.admin, password:req.body.password})
    
    if(adminFound){
        req.session.admin = req.body.admin
        res.redirect('adminPanel')
    }
    else
        res.render('admin',{error:"Wrong Credentials!"})  
})

router.get('/adminPanel',(req,res)=>{
    if(req.session.admin){
        userModel.find((err,data)=>{
            if(err) console.log(err.message)
            else{
                blogModel.find((err,blogs)=>{
                    if(err) console.log(err.message)
                    else{
                        blogNo = blogs.length 
                        len = data.length
                        res.render('adminPanel',{admin:req.body.admin, users: data, len: len, blogNo: blogNo})
                    }
                })
            }
        })
        
    }
    else
        res.render('unauthorized') 
})

router.get('/search',(req,res)=>{
    if(req.session.admin){
       userModel.find({$or: [{name: req.query.search},{userName: req.query.search},{email: req.query.search}]},(err,data)=>{
        len = data.length
        res.render('adminPanel',{admin:req.body.admin, users: data, len: len, blogNo: 3})
        }) 
    }
    else{
        res.render('unauthorized')
    }
    
})

router.post('/addUser', (req,res)=>{
    console.log(req.body)
    userModel.insertMany([{userName: req.body.user,name:req.body.name, password: req.body.password, email: req.body.email}])
    res.redirect('adminPanel')
    
})

 module.exports = router