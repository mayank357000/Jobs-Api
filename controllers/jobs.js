const Job=require('../models/Job');
const {StatusCodes}=require('http-status-codes');
const {BadRequestError,NotFoundError}=require('../errors')


//FLOW HAI YE APP KA 
//flow aisa ki authrntication routes se document ban gya
//ya create hua db mai
//phir token hamne bheja apne frontend ko
//ab wo job routes access krega
//jab access krega thne meets auth middleware jo hamne job routes ke upar add kiya 
//wo token check krega 
//aur hamne token mai id daal rakhi thi
//so req.body mai id add kr denge as property and 
//and that will be used afterwards to see user kaunsa hai 
const getAllJobs = async (req, res) => {
  //we want to only give those jobs which are created by this
  //specefioc user which has logged/registerd in 
 const jobs=await Job.find({createdBy:req.user.userId}).sort('createdAt');
 res.status(StatusCodes.OK).json(jobs);
};

const getJob = async (req, res) => {
  const {id:jobId}=req.params;
  const {userId}=req.user;
  const job=await Job.findOne({
    _id:jobId,
    createdBy:userId
  })
  if(!job)
  {
    throw new NotFoundError(`No job with id ${jobId}`);

  }
  res.status(StatusCodes.OK).json({job});
};

const createJob = async (req, res) => {
  //from front end we are sending data example :{"company":"google", "position":"intern"}

  req.body.createdBy=req.user.userId;//jo createdBy property aur thi wo add 
  const job=await Job.create(req.body);
  console.log(job)
  res.status(StatusCodes.CREATED).json({job});
};

const updateJob = async (req, res) => {
  const { id: jobId } = req.params;
  const { userId } = req.user;
  const {company,position}=req.body;

  if(company===''||position==='')
  {
    throw new BadRequestError("Company or Postion fields can't be empty");
  }
  const job=await Job.findByIdAndUpdate({_id:jobId,createdBy:userId},req.body,{new:true,runValidators:true});
  if(!job){
    throw new NotFoundError(`no job with id ${jobid}`);
  }
  // console.log(job);
  res.status(StatusCodes.OK).json({job});
};

const deleteJob = async (req, res) => {
   const { id: jobId } = req.params;
   const { userId } = req.user;
   const job=await Job.findByIdAndRemove({
    _id:jobId,
    createdBy:userId
   })
if (!job) {
  throw new NotFoundError(`no job with id ${jobid}`);
}
 res.status(StatusCodes.OK).send();  
};

module.exports = {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
};
