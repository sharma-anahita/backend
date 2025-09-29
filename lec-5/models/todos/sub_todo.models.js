import mongoose from 'mongoose'

//make schema

const userSchema = new mongoose.Schema({
    username :{
        type : String,
        required :true,
        unique : true
    },
    email : {
        type: String,
        required : [true,"email is to be given"],
        unique: true,
        lowercase : true
    }
        ,
        password:{
            type : String,
            required : [true,"password is required"],
            min : [8, "password must be atleast 8 characters"]
        },
    isActive : Boolean,
    contact_email : String ,
    contactSameEmail : Boolean
},
{
    timestamps : true
}
)

//export this schema or this won't be make

export const User = mongoose.model("User",userSchema) // kya model banana h aur kiske basis pe banana h