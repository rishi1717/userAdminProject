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
    let userError = "" ,nameError = "" ,CPasserror = "", passError = "" 
    if(req.body.user.length<5){
       userError = "Atleast 5 characters required!"
    }
    if(req.body.name.length<3){
        nameError = "Atleast 3 characters required!"
    }
    if(req.body.password!=req.body.Cpassword){
        CPasserror = "Passwords dont match!"
    }
    if(req.body.password.length<6){
        passError = "Atleast 6 charecters required"
    }
    if(userError||nameError||CPasserror){
        res.render('register',{userError:userError,nameError:nameError,CPasserror:CPasserror})
    }
    
    // userModel.insertMany([{userName: req.body.user, name:req.body.name, password: req.body.password, email: req.body.email}])
    // res.redirect('/')
    
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
        res.render('adminUnauthorized') 
})

router.get('/search',(req,res)=>{
    if(req.session.admin){
       userModel.find({$or: [{ name: { $regex: req.query.search, $options: "i" }} ,{userName: { $regex: req.query.search, $options: "i" }},{email: { $regex: req.query.search, $options: "i" }}]},(err,data)=>{
        len = data.length
        res.render('adminPanel',{admin:req.body.admin, users: data, len: len, blogNo: 3})
        }) 
    }
    else{
        res.render('adminUnauthorized')
    }
    
})

router.post('/addUser', (req,res)=>{
    console.log(req.body)
    userModel.insertMany([{userName: req.body.user,name:req.body.name, password: req.body.password, email: req.body.email}])
    res.redirect('adminPanel')
    
})

router.get('/updateClick/:id',(req,res)=>{
    if(req.session.admin){
        userModel.find({_id: req.params.id},(err,data)=>{
        if(err) console.log("error finding user")
        else{
            console.log(data);
            res.render('updateUser',{user: data})
        }
    })
    }
    else{
        res.render('adminUnauthorized')
    }
    
})

router.post('/updateUser', (req,res)=>{
    if(req.session.admin){
       userModel.updateOne({_id:req.body._id},{userName: req.body.user,name:req.body.name, password: req.body.password, email: req.body.email}).then((m)=>{
            console.log(m)
            res.redirect('adminPanel')
        })
        .catch((e)=>{
            console.log(e.message);
    }) 
    }
    
})

router.get('/deleteUser/:user', async (req,res)=>{
    await userModel.deleteOne({userName: req.params.user}).then((m)=>{
        console.log(m);
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
    }).catch((e)=>{
        console.log(e.message);
    })
})


 module.exports = router