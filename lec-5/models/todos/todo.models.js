import mongoose from 'mongoose'

const todoSchema = new mongoose.Schema(
    {
        title : {
            type : String,
            trim: true,
            required : true,
            unique: true

        },
        complete :{
            type: Boolean ,
            default : false
        },
        description :{
            type: String,
            trim : true
        },
        createdBy :{
            //connecting to the user
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
        },
        subTodos : [
            {
                type : mongoose.Schema.Types.ObjectId,
                ref : "subTodo"
            }
        ] //array of subTodos
        
    },
    {
        timestamps  : true
    }
)

export const Todo  = new mongoose.model('Todo',todoSchema)