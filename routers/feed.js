const express=require("express");
const router=express.Router();
const feedController=require('../controllers/feed');
const {body}=require('express-validator');
const isAuth=require("../middleware/is-auth");

router.get('/',(req,res,next)=>{
    return res.send("Welcome");
})

router.get("/posts",isAuth,feedController.getPosts);

router.post('/Addpost',[
    body('title')
      .trim()
      .isLength({ min: 5 }),
    body('content')
      .trim()
      .isLength({ min: 5 })
  ],isAuth,feedController.createPost);

router.get('/post/:id',isAuth,feedController.getPost);

router.put('/post/:id',[
  body('title')
    .trim()
    .isLength({ min: 5 }),
  body('content')
    .trim()
    .isLength({ min: 8 })
],isAuth,feedController.updatePost);

router.delete('/post/:id',isAuth,feedController.deletePost);

module.exports=router;