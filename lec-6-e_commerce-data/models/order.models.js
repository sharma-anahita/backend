import mongoose from "mongoose";

const orderItemsSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  quantity: {
    type: Number,
    required: true,
  },
});

const orderSchema = new mongoose.Schema(
  {
    orderPrice: {
      type: Number,
      required: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    orderItems: [orderItemsSchema],
    address :{
        type : String,
        required :true
    },
    orderStatus:{
        type : String ,
        enum : ['delivered','pending','cancelled','shipped'],
        default : 'pending', 
    }
  },
  
  {
    timestamps: true,
  }
);

export const Order = mongoose.model("Order", orderSchema);
