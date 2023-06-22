const { BadRequestError ,UnauthenticatedError} = require('../errors');
const User=require('../models/User');
const {StatusCodes}=require('http-status-codes');
const jwt=require('jsonwebtoken');

const register=async(req,res)=>{

    //agr password ,name ya email nhi toh by default
    //mongoose main schema defined validators se error bhejta hai
    //else apn khudka bhi bhej skte hai error custom like this below

    // const {name,email,password}=req.body;
    // if(!name||!email||!password)
    // {
    //     throw new BadRequestError('Please provide password/email/name');
    // }


//since mongoose provide its own hooks(genraally unko mongoose ke mddleware
// middleware bolte hai kyuki wo doc bnne ke pehle ya badme kaam krte hai
//aur next function hota hai jo next hook/middleware ko trigger krta hai/pass flow )
//but bs different from express middleware 
//kuhc common nhi , apne aap mai mongoose ki cheez
//middleware in general jo req milne ke beechmain kaam krey

//So we can add this code to mongoose hook of pre('save')
//doc bnne se pehle hash kr dega 

    //  const { name, email, password } = req.body;
    //   const salt=await bcrypt.genSalt(10);//rounds of hashing
    //   const hashedPassword=await bcrypt.hash(password,salt);
    //   const tempUser={name,email,password:hashedPassword};


    // const user = await User.create({ ...req.body });
    // res.status(StatusCodes.CREATED).json({...req.body});

//we can use custom instance methods on any mongoose schema 
//so here we use that to create jwt token to keep
//all the logic related to schema in one place


    const user=await User.create({...req.body});
    //user is mongoose instance of schema 
    //so we can use mongoose custom instacne mehtods on it

    const token=user.createJWT();
    res.status(StatusCodes.CREATED).json({user:{name:user.name},token});
  }

const login = async (req, res) => {
   const {email,password}=req.body;
    if(!email||!password)
    {
        throw new BadRequestError('Please provide password and email');
    }

    const user=await User.findOne({email});
     if (!user) {
       throw new UnauthenticatedError("Please provide correct credentials");
     }
    
    //compare passowrd
    isPasswordCorrect=await user.comparePassword(password);//apna custom instance method used to verify password
    //can use all the schema doc properties 
    if (!isPasswordCorrect) {
      throw new UnauthenticatedError("Please provide correct credentials");
    }

    const token=user.createJWT();
    res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};

module.exports={
    register,
    login
}