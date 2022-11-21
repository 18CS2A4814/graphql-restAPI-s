const router=require('express').Router();
const User=require('../model/user');
const {body}=require("express-validator");
const authController=require('../controllers/auth');

router.put('/signup',[
    body('email','invalid email').isEmail()
    .custom((value,{req})=>{
        return User.findOne({email:value}).then((userDoc)=>{
            if(userDoc)
            {
                return Promise.reject("Email already exists");
            }
        })
    }).trim().normalizeEmail(),
    body('password').trim().isLength({min:5}),
    body('name').trim().not().isEmpty()
],authController.signup);

router.post('/login',authController.login);

module.exports=router;