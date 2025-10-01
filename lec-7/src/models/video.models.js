import mongoose ,{Schema} from "mongoose";

const videoSchema = new Schema ({
    videoFile :{
        type :String,
        required :true
    },
    thumbnail :{
        type :String,
        required : true,
    },
    owner:{
        type :Schema.Types.ObjectId,
        ref :"User"
    },
    title:{
        type :String,
        required :true,

    },
    description:{
        type:String,
        minlength : 10,
        required :true,
    },
    duration:{
        type :Number
    },
    viwes:{
        type :Number,
        default : 0
    },
    isPublished:{ //private or not
        type: Boolean,
        default :true
    },
    

},
{
    timestamps: true
})

export const Video = mongoose.model("Video",videoSchema)