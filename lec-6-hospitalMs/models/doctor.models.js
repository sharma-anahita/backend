import mongoose from 'mongoose'

const hosHoursSchema = new mongoose({
    
})
const doctorSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    salary : {
        type : Number,
        required : true
    },
    experienceInYears : {
        type : Number,
        default : 0,
        required : true
    },
    qualifications : [{
        type : String,
        required : true
    }],
    hospitalsWorkingAt :[{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Hospital"
    }]
},
{
    timestamps : true
}
)

export const Doctor = mongoose.model("Doctor",doctorSchema)