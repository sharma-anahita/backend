import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { validator } from "validator";
import { User } from "../models/user.models.js"; //calls mongoDb on ur behalf
import { uploadOnCloudinary } from "../utils/cloudinary.js";

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
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar image is required");
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
        coverImage: coverImage.url || "",
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
    return res.status(201).json(
        new ApiResponse(200,createdUser,"User registered sucessfully")
    )
});

export { registerUser };
