import mongoose from 'mongoose'

const categSchema = new mongoose.Schema({
    name :{
        type : String,
        required :true
    },
},
{
    timestamp : true
}
)

export const Category = mongoose.model("Category",categSchema)