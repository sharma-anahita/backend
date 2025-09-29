import mongoose from 'mongoose'
//can add realpice and selling price
const productSchema  = new mongoose.Schema({
    name :{
        type: String,
        required :true
    },
    description :{
        type :String,
        required :true,
    },
    productImage :{
        type : String //in the form of url 
    },
    price :{
        type : Number,
        required : true,
        default : 0,
    
    },
    stock :{
        type : Number,
        required : true,
        default :0,
    },
    seller :{
        type : mongoose.Schema.Types.ObjectId,
        ref :"User"
    },
    category :{
        type : mongoose.Schema.Types.ObjectId,
        ref :"Category",
        required : true,
    }
},
{
    timestamps : true
}
)

export const Product = mongoose.model('Product',productSchema)