const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {
  console.log(err);

   //apne custom error classes ke alawa mongoose bhi 3 erros de rha hai
   //duplicate email 
   //cast error-agr id ka syntax wrong/lessmore len
   //schema validation errors 

  let customError={
    statusCode:err.statusCode||StatusCodes.INTERNAL_SERVER_ERROR,
    msg:err.message||'Something wnet wrong try again later',
  }

  // //since apne custom class errors pr bhi same properties of messgae and status code 
  // //we can remove this if block and thins will work the same
  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statusCode).json({ msg: err.message })
  // }


  if(err.name==='ValidationError')
  {
    console.log(Object.values(err.errors));
    customError.msg=Object.values(err.erros)
    .map((item)=>item.message)
    .join(',')
    customError.statusCode=400;
  }

  if(err.code && err.code===11000)//duplciate email ke error wala message se nikala ye
  {
    //keyValue: { email: 'micky@gmail.com' }
    customError.msg = `Duplicate value entered for ${Object.keys(err.keyValue)} field, please choose another value`;
    customError.statusCode = 400; //bad request
  }

  IF(err.name==='CastError')
  {
    customError.msg=`no item found with id ${err.value}`;
    customError.statusCode=404;
  }
  return res.status(customError.statusCode).json({ msg:customError.msg })
}

module.exports = errorHandlerMiddleware
