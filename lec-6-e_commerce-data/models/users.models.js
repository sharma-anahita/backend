import mongoose from 'mongoose'
//which user is customer or seller 
const userSchema = new mongoose.Schema({
    username :{
        type : String,
        required : true,
        unique : true
    },
    password :{
        type :String,
        required :true,
        minlength : [8,'password must be 8 characters minimun']
    },
    email :{
        type : String,
        required : true,
        lowercase : true,
        unique : true
    },
    main_phone :{
        type : String,
        required :true,
        minlength:10,
        maxlength : 10,
        match : ['/^\d{10}$/','only valid phone numbers are allowed']
    },
    emergency_phone  :{
        type : String, 
        minlength:10,
        maxlength : 10,
        match : ['/^\d{10}$/','only valid phone numbers are allowed']
    },
    address : [
        {
            type: String //address has to have its own attributes
        }
    ],
    role : {
        type:String,
        enum : ["seller","customer"],
        default :["customer"]

    }
},
{
    timestamps: true
}
)

export const User = mongoose.model("User",userSchema)