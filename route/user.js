const { User } = require("../models/user");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const upload = require("../middleweres/upload");



router.get('/', async(req,res)=>{
  const UserList = await User.find()
  if(!UserList){
    res.status.json({
      success:false
    })
  }
  res.send(UserList)
})
router.get('/:id', async(req,res)=>{
  try {
    const UserList = await User.findById(req.params.id)
  if(!UserList){
    res.status.json({
      success:false
    })
  }
  res.status(200).send(UserList)
  } catch (error) {
    console.log(error)
  }
})
router.delete('/:id', async(req,res)=>{
  try {
    User.findByIdAndDelete(req.params.id).then(user=>{
      if(user){
        return res.status(200).json({
          success:true,message:'the user is deleted!'
        })
      }else{
        return res.status(404).json({
          success:false,
          message:'user not found'
        })
      }
    })
  } catch (error) {
    return res.status(500).json({
      success:false,
      error:error
    })
  }
})

router.get('/get/count', async (req, res) => {
  try {
    const userCount = await User.countDocuments(); // ❌ No callback

    res.status(200).json({
      success: true,
      userCount: userCount
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// update 
router.put('/:id',async(req,res)=>{
  const {name,phone ,email,password}= req.body;

  try {
    const userExist = await User.findById(req.params.id);
    let newPassword ;
    if(password){
      newPassword = bcrypt.hashSync(password,10)
    }else{
      newPassword = userExist.password
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        name:name,
        phone:phone,
        email:email,
        password:newPassword
      },
      {new:true}
    )

    if(!user){
      return res.status(400).send('the user cannot be Updated!')
    }
    res.send(user)
  } catch (error) {
    return res.status(500).send({error:error})
  }


})

router.post("/signup",upload.none(), async (req, res) => {
  const { name, phone, email, password,isAdmin } = req.body;
  try {
    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      return res.status(400).json({
        msg: "User already exists!",
      });
    }
   const existingPhone = await User.findOne({ phone });
  if (existingPhone) {
    return res.status(400).json({ msg: "Phone already exists!" });
  }

    const hashPassword = await bcrypt.hash(password, 10);
    let role = 'user'; // ✅ fallback default role

if (isAdmin === 'true') {
  
  role = 'admin'; // ✅ override if allowed
}
    const result = await User.create({
      name: name,
      phone: phone,
      email: email,
      password: hashPassword,
       role:role
    });

    const token = jwt.sign(
      { email: result.email, id: result._id,role: result.role },
      process.env.JSON_WEB_TOKEN_SECRET_KEY,{ expiresIn: "1d" }
    );

    res.status(200).send({
      user: result,
      token: token,
    });
  } catch (err) {
  // ✅ Catch duplicate key error
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      return res.status(400).json({
        msg: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists!`,
      });
    }

    res.status(500).json({ msg: "Something went wrong", error: err.message });
  }
});



router.post('/signin',upload.none(), async (req,res) =>{

  const {email,password} = req.body;
  console.log("Email:", email);
  console.log("Password:", password);

  try{
      const existingUser = await User.findOne({ email:email });

    if (!existingUser) {
      return res.status(400).json({
        msg: "Don't have an account please create an account!",

      });
    }

    const matchPassword = await bcrypt.compare(password,existingUser.password)
    if(!matchPassword) {
      return res.status(400).json({msg:"Invalid credentails"})
    }
  const token = jwt.sign({email:existingUser.email,id:existingUser._id},
    process.env.JSON_WEB_TOKEN_SECRET_KEY,
    { expiresIn: "1d" }
  )

  // Don't send password in response
    const { password: _, ...userWithoutPassword } = existingUser._doc;

  res.status(200).json({
    user:userWithoutPassword,
    token,
    msg:"user Authenticated!"
  })

  }catch(err){
    console.log(err)
    res.status(500).json({msg:"something went wrong"})
  }


})

module.exports = router;
