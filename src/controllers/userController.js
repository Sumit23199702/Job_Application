const bcrypt = require("bcrypt");
const UserModel = require("../models/userModel");
const jwt = require("jsonwebtoken");

const {
  isValid,
  isValidObjectId,
  isValidName,
  isValidEmail,
  isValidMobile,
  isValidPassword,
} = require("../utils/validator");

// Register User
const createUser = async (req, res) => {
  try {
    let userData = req.body;

    if (!userData || Object.keys(userData).length === 0) {
      return res.status(400).json({ msg: "Bad Request! No Data Provided" });
    }

    let { fullName, email, password, mobile } = userData;

    // FullName Validation
    if (!isValid(fullName)) {
      return res.status(400).json({ msg: "Full Name is Required" });
    }

    if (!isValidName(fullName)) {
      return res.status(400).json({ msg: "Invalid Name" });
    }

    // Email Validation
    if (!isValid(email)) {
      return res.status(400).json({ msg: "Email is Required" });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ msg: "Invalid Email" });
    }

    let emailExist = await UserModel.findOne({ email });
    if (emailExist) {
      return res.status(400).json({ msg: "Email Already Exists" });
    }

    // Mobile  Number Validation
    if (!isValid(mobile)) {
      return res.status(400).json({ msg: "Contact Number is Required" });
    }

    if (!isValidMobile(mobile)) {
      return res.status(400).json({ msg: "Invalid Contact Number" });
    }

    let mobileNoExist = await UserModel.findOne({ mobile });
    if (mobileNoExist) {
      return res.status(400).json({ msg: "Contact Already Exists" });
    }

    // Password Validation
    if (!isValid(password)) {
      return res.status(400).json({ msg: "Password is Required" });
    }

    if (!isValidPassword(password)) {
      return res.status(400).json({
        msg: "Password must be 8-20 Chars with uppercase, lowercase, numbers and special characters.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    userData.password = hashedPassword;

    let addedUser = await UserModel.create(userData);
    return res.status(201).json({ msg: "User Added Successfully", addedUser });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Login User
const loginUser = async (req, res) => {
  try {
    let userData = req.body;
    if (!userData || Object.keys(userData).length === 0) {
      return res.status(400).json({ msg: "Bad Request! No Data Provided" });
    }

    let { email, password } = userData;

    if (!isValid(email)) {
      return res.status(400).json({ msg: "Email is Required" });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ msg: "Invalid Email" });
    }

    if (!isValid(password)) {
      return res.status(400).json({ msg: "Password is Required" });
    }

    if (!isValidPassword(password)) {
      return res.status(400).json({
        msg: "Password must be 8-20 Chars with uppercase, lowercase, numbers and special characters.",
      });
    }

    let user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ msg: "User Not Found" });
    }

    let passwordCheck = await bcrypt.compare(password, user.password);

    if (!passwordCheck) {
      return res.status(400).json({ msg: "Incorrect Password" });
    }

    let token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1d",
      },
    );

    return res.status(200).json({ msg: "Login Successfull", token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Get My Profile
const getProfile = async (req, res) => {
  try {
    let userId = req.userId;

    let user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User Not Found" });
    }

    return res.status(200).json({ msg: "Profile Fetched Successfully", user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Delete Profile
const deleteProfile = async (req, res) => {
  try {
    let userId = req.userId;
    let deleteUser = await UserModel.findByIdAndDelete(userId);

    if (!deleteUser) {
      return res.status(404).json({ msg: "User Not Found or already deleted" });
    }
    return res.status(200).json({ msg: "User Deleted Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

module.exports = { createUser, loginUser, getProfile, deleteProfile };
