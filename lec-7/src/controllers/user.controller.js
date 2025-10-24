import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import validator from "validator";
import { User } from "../models/user.models.js"; //calls mongoDb on ur behalf
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";

//register a user -> has a lot of steps
//get info, retreive it, save it on db, send response to user that he has been registers

const registerUser = asyncHandler(async (req, res) => {
    //get user details from front-end
    //validate the data given ->not empty and in correct format
    //check if user already exists -> via username and email
    //check for images, check for avatar
    //if yes , upload on cloudinary , check avatar uploaded or not
    //create a user object (for mongoDb) ->create entry in db
    //remove password and refresh token feild from response
    //check for user creation
    //return res

    //get user details from front-end
    const { fullName, email, username, password } = req.body;

    //    validate the data given ->not empty and in correct format
    if (
        [fullName, email, username, password].some(
            (feild) => feild?.trim() === ""
        )
    ) {
        throw new ApiError("All feilds are requiered");
    }
    if (!validator.isEmail(email)) {
        throw new ApiError(400, "invalid email format");
    }
    if (
        !validator.isStrongPassword(password, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
        })
    ) {
        throw new ApiError(400, "password is not strong enough");
    }

    //find if existing username or email
    const existedUser = await User.findOne({
        $or: [{ username }, { email }],
    });
    if (existedUser) {
        throw new ApiError(409, "User already exists"); //throw error for existing email or username
    }

    // check for images, check for avatar
    let avatarLocalPath;
    if (
        req.files &&
        Array.isArray(req.files.avatar) &&
        req.files.avatar.length > 0
    ) {
        avatarLocalPath = req.files.avatar[0].path;
    }
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar image is required");
    }
    // const coverImageLocalPath = req.files?.coverImage[0]?.path ; added a check
    let coverImageLocalPath;
    if (
        req.files &&
        Array.isArray(req.files.coverImage) &&
        req.files.coverImage.length > 0
    ) {
        coverImageLocalPath = req.files.coverImage[0].path;
    }

    //upload on cloudianry ->takes time so await ,aage nahi ja sakte
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if (!avatar) {
        throw new ApiError(400, "Avatar image is required");
    }

    //create a user object (for mongoDb) ->create entry in db
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage ? coverImage.url : "",
        email,
        password,
        username: username.toLowerCase(),
    });

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken" //elements which aren't selected
    );
    if (!createdUser) {
        throw new ApiError(500, "couldn't register the user");
    }
    //return res
    return res
        .status(201)
        .json(new ApiResponse(200, createdUser, "User registered sucessfully"));
});

const loginUser = asyncHandler(async (req, res) => {
    //take credentials from req body
    // check existence in Db
    //check password
    //generate access and refresh token
    //send cookie (secure cookies)
    //if yes move them to home page//

    //taking credentials from the user requests
    const { email, username, password } = req.body;
    if (!username && !email) {
        throw new ApiError(400, "username or email is requiered to login");
    }
    //check existence in Db
    //user is the db instance User.findOne is going to return
    const user = await User.findOne({
        $or: [{ email }, { username }],
    });
    if (!user) {
        throw new ApiError(400, "User not found");
    }
    const isPasswordValid = await user.checkPassword(password);
    if (!isPasswordValid) {
        throw new ApiError(400, "Invalid User credentials");
    }

    //make access and refresh tokens ->often used so places inside a function

    const generateAccessAndRefreshTokens = async (userId) => {
        try {
            const user = await User.findById(userId);
            const accessToken = await user.generateAccessToken();
            const refreshToken = await user.generateRefreshToken();

            user.refreshToken = refreshToken;
            await user.save({ validateBeforeSave: false }); //do not validate before saving -> we dont need to

            return { accessToken, refreshToken };
        } catch (error) {
            throw new ApiError(
                500,
                "something went wrong while generating the access and refresh tokens"
            );
        }
    };
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
        user._id
    );

    //send cookies
    //our user doesnt have access and refresh tokens rn, we need to get it from the Db(could be expensive you need to check that)
    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    ); //we dont want to send these to the user

    //defining options for cookies
    const options = {
        httpOnly: true,
        secure: true,
    };
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken, //for the user if he wants to use these token
                },
                "User logged in succesfully"
            )
        );
});

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id, {
        $set: {
            refreshToken: undefined,
        },
    });
    const options = {
        httpOnly: true,
        secure: true,
    };
    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, "User logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken =
        req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request"); // no refresh token was given
    }
    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );
    
        const user = await User.findById(decodedToken?._id);
        if(!user){
            throw ApiError(401,"Invalid refresh token")
        }
        //we have a valid token
        if(incomingRefreshToken !== user?.refreshToken){
            throw ApiError(401,"Refresh token has been expired or used")
        }
        //matching tokens 
        //generateing new tokens
        const options = {
            httpOnly : true,
            secure :true
        }
        const {accessToken, newrefreshToken} = generateAccessAndRefreshTokens(user._id);
        return res.status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",newrefreshToken,options)
        .json(
            new ApiResponse(
                200,
                {accessToken,
                    refreshToken : newrefreshToken},
                "Access token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401,error.message||"refresh token error")
    }

    
});

const changeCurrentPassword = asyncHandler(async (req,res)=>{
    //take in feilds
    const {oldPassword, newPassword} = req.body; //can add confirm password
    const user = User.findById(req.user?._id);
    const isPasswordCorrect = user.checkPassword(oldPassword);
    if(!isPasswordCorrect){

        //check if prev password is corred
    }
    //set the new password
    user.password = newPassword;
    await user.save({validateBeforeSave :false});
    return res
    .status(200)
    .json(new ApiResponse(200,{},"Password Changed successfully"));
});

const getCurrentUser = asyncHandler( async(req,res)=>{
    return res.status(200)
    .json(200,req.user,"current user fetched succesfully")
});

//can add functionality to update details like username
//make different endpoints for files


//updating text based data
const updateAccountDetails = asyncHandler (async (req,res)=>{
    const {fullName,email} = req.body;

    if(!fullName && !email ){
        throw new ApiError("All feilds are requiered");
    }
    const user =  User.findByIdAndUpdate(
        req.user?._id,
        {
            $set :{
                fullName : fullName,
                email :email
            }
        },
        {new:true}
    ).select("-password")
    return res.status(200)
    .json(
        new ApiResponse(200,"Account details updated succesfully")
    )
});
export { registerUser, loginUser, logoutUser,refreshAccessToken,getCurrentUser ,changeCurrentPassword};
