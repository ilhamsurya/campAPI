const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async')


//@desc Register User
//@route post /api/v1/auth/register
//@access Public

exports.register = asyncHandler(async (req, res, next) => {
    const {
        name,
        email,
        password,
        role
    } = req.body;

    // Create user
    const user = await User.create({
        name,
        email,
        password,
        role
    });

    sendTokenResponse(user, 200, res);
})

//@desc Login User
//@route post /api/v1/auth/login
//@access Public

exports.login = asyncHandler(async (req, res, next) => {
    const {

        email,
        password
    } = req.body;

    //Validate email & password
    if (!email || !password) {
        return next(new ErrorResponse('Please check your email and password', 400));
    }

    //check for user 
    const user = await User.findOne({
        email
    }).select('+password');

    if (!user) {
        return next(new ErrorResponse('Invalid Authentication', 401));
    }

    //Check if password match
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        return next(new ErrorResponse('Invalid Authentication', 401));
    }

    sendTokenResponse(user, 200, res);
})

// Get Token from model, create cookie and send reesponse

const sendTokenResponse = (user, statusCode, res) => {
    //Create token
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    }

    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }

    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token
        })
}

//@desc Get CurrentLogin User
//@route post /api/v1/auth/me
//@access Private 

exports.getMe = asyncHandler(async (req, re, next) => {
    const user = await User.findById(req.user.id)

    res.status(200).json({
        success: true,
        data: user
    })


})