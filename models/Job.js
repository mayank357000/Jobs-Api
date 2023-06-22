const mongoose=require('mongoose');

const JobSchema=new mongoose.Schema(
    {
        company:{
            type:String,
            required:[true,'Please Provide company Name'],
            maxlength:50,
        },
        position:{
            type:String,
            required:[true,'Please Provide Position'],
            maxlength:100,
        },
        status:{
            type:String,
            enum:['interview','declined','pending'],
            default:'pending'
        },
        createdBy:{
            type:mongoose.Types.ObjectId,//mongoose ki objectid bhej denge isme
            ref:'User',//model we are referencing tob
            required:[true,'Please Provide user']
        }
    },{timestamps:true}
)

module.exports=mongoose.model('Job',JobSchema);