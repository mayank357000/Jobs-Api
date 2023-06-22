const mongoose=require('mongoose');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require('dotenv').config();

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Provide name"],
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: [true, "Please Provide email"],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      ,
      "please provide correct email",
    ],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please Provide password"],
    minlength: 6
  },
});

//mongoose hooks schema pr lgte hai
//ye pre method ka save event wala hook
//doc ke save hone se pehle trigger
//use function keyword and not our arrow funciton
//becuase 'this' here will refer to the doc 
//jiske liye ye hook trigger ho rha hai

//hook for hashing password before saving/entering in db
UserSchema.pre('save',async function(next){//iske pass document ki saari entries ka access hoga 
  const salt=await bcrypt.genSalt(10)
  this.password=await bcrypt.hash(this.password,salt)
  next();
  //new version mai next ko nhi bhi use then too will work
});


//custom mongoose instance methods for a schema doc 
//can be called on any doc of this schema and will be
//able to access all doc properties using this 
UserSchema.methods.createJWT=function(){
  return jwt.sign(
    { userId: this._id, name: this.name },//can access doc fields in hooks
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );//returning token
}


UserSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);//brcypt ka inbuilt method to compare
  //hashed password and and coming password
  return isMatch;
};
module.exports=mongoose.model('User',UserSchema);

