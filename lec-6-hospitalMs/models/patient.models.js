import mongoose from 'mongoose'

const patientSchema = new mongoose.Schema({
    name :{
        type :String,
        required : true
    },
    disgonosis :{
        type : String,
        required : true
    },
    address :{
        type : String,
        required : true
    },
    email :{
        type : String,
        required : true
    },
    age :{
        type : Number,
        required : true
    },
    bloodGroup :{
        type : String,
        required : true
    },
    gender :{
        type : String,
        enum : ["M","F","O"],
        required :true
    },
    phoneNumber :{
        type : String,
        minlength : 10,
        maxlength : 10,
        required : true
    },
    admittedAt :{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Hospital"
    }
},
{
    timestamps : true
}
)

export const Patient = mongoose.model("Patient",patientSchema)