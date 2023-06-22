const User =require('../models/User')
const jwt=require('jsonwebtoken');
const {UnauthenticatedError}=require('../errors')

//ye middleware saare auth wale routes pr lg rha hai
//jaise hi req ayi , ye check krega 
//ki token bheja hai ya nhi
//agr bheja hai then check secret key use ki thi kya usme
//agr haa then payload milega apne ko sahi wala 
//we can be sure sahi user hai
//aur ham req object pr user property add kr denge 
//jisse ham job routes mai is user ki id use kr pae


//FLOW HAI YE APP KA 
//flow aisa ki authrntication routes se document ban gya
//ya create hua db mai
//phir token hamne bheja apne frontend ko
//ab wo job routes access krega
//jab access krega thne meets auth middleware 
//wo token check krega 
//aur hamne token mai id daal rakhi thi
//so req.body mai id add kr denge as property and 
//and that will be used afterwards

const auth=async (req,res,next)=>{
    //check header
    const authHeader=req.headers.authorization;
    if(!authHeader||!authHeader.startsWith('Bearer '))
    {
        throw new UnauthenticatedError('Authentication Invalid');
    }

    const token=authHeader.split(' ')[1];

    try {
        //check given toke by our secret key
       const payload=jwt.verify(token,process.env.JWT_SECRET);//agr match nhi then error
       //attach to the job routes
       req.user={userId:payload.userId,name:payload.name} 
       next();
    } catch (error) {
        throw new UnauthenticatedError('Authentication Failed');
    }
}

module.exports=auth;