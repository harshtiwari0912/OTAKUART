const userModel = require('../models/usermodel');
const jwt= require('jsonwebtoken');
const bcrypt=require('bcrypt');
module.exports.registeruser = async (req , res)=>
{
    let {email,password,fullname}=req.body;
    let user = await userModel.findOne({email});
    if(user) return res.status(201).send('you already registered !!');
    try{
        bcrypt.genSalt(10,(err,salt)=> {
        if(err) return res.send(err.message);
        bcrypt.hash(password,salt,async (err,hash)=>
        {
            if(err) res.send(err.message)
            else
        {
             let user = await userModel.create(
                {
                    email,
                    fullname,
                    password:hash
                }
            )
            let token=jwt.sign({email:email,userid:user._id},process.env.JWT_KEY);
            res.status(300).cookie('token',token);
            res.send('user created succesfully');
        }
        })
    })
    }
    catch(err)
    {
        res.send(err.message);
    }
}
module.exports.loginuser = async(req,res)=>
{
    let {email,password}=req.body;
    let user = await userModel.findOne({email});
    if(!user)  {req.flash('error','Email or password incorrect -_-');
        res.redirect('/');
    }
    else
   { bcrypt.compare(password,user.password,(err,result)=>
    {
        if(err) res.send(err.message);
        else
        {
            if(!result) {req.flash('error','something went wrong !!');
                res.redirect('/');
            }
            else {
                let token = jwt.sign({email,_id:user._id},process.env.JWT_KEY);
                res.cookie('token',token);
                res.redirect('/shop');
            }
        }
    })}
}
module.exports.logoutuser= (req, res) => {
  res.clearCookie('token'); // or `req.session.destroy()` if using sessions
  req.flash('success', 'You have been logged out.');
  res.redirect('/');
}