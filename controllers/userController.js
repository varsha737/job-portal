import userModel from "../models/userModel.js";
import User from '../models/userModel.js';

export const updateUserController = async (req, res) => {
  console.log("reached till here")
  console.log("req.params.userId")
  const { name, email, lastName, location } = req.body;
  if (!name || !email || !location) {
      return res.send("something is missing")
  }
  const user = await userModel.findOne({ _id: req.params.userId });
  user.name = name;
  user.lastName = lastName;
  user.email = email;
  user.location = location;
   console.log(user)
  await user.save();
  res.status(200).json({
    user,
    token,
  });
};

// get user data
export const getUserController = async (req,res,next) => {
  try{
    const user = await userModel.findById({_id:req.body.user.userId});
    user.password = undefined
    if(!user){
      return res.status(200).send({
        message:'User Not Found',
        success:false,
      })
    }else{
      res.status(200).send({
        success:true,
        data:user,
      });
    }
  } catch(error) {
    console.log(error);
    res.status(500).send({
      message:'auth error',
      success:false,
      error:error.message
    });
  };
};

// Get user profile
export const getUserProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ user });
    } catch (error) {
        next(error);
    }
};

// Update user profile
export const updateProfile = async (req, res, next) => {
    try {
        const {
            name,
            location,
            skills,
            education,
            experience,
            phone,
            about,
            social
        } = req.body;

        // Find user
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update fields
        if (name) user.name = name;
        if (location) user.location = location;
        if (skills) user.skills = skills;
        if (education) user.education = education;
        if (experience) user.experience = experience;
        if (phone) user.phone = phone;
        if (about) user.about = about;
        if (social) user.social = social;

        await user.save();

        // Return updated user without password
        const updatedUser = await User.findById(req.user.userId).select('-password');
        res.status(200).json({
            message: 'Profile updated successfully',
            user: updatedUser
        });
    } catch (error) {
        next(error);
    }
};
