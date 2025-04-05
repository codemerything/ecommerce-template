import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { redis } from "../config/redis.js";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../config/env.js";

//UTILITY FUNCTIONS TO GENERATE TOKENS AND STORE REFRESH TOKENS
const generateToken = (userId) => {
  const accessToken = jwt.sign({ userId }, ACCESS_TOKEN, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign({ userId }, REFRESH_TOKEN, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};

const storeRefreshToken = async (userId, refreshToken) => {
  await redis.set(
    `refreshToken:${userId}`,
    refreshToken,
    "EX",
    7 * 24 * 60 * 60
  ); // 7 Days
};

//UTILITY FUNCTION TO SET COOKIES

const setCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true, // prevent XSS attacks
    sameSite: "strict", // prevent CSRF attacks
    secure: process.env.NODE_ENV === "production",
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true, // prevent XSS attacks
    sameSite: "strict", // prevent CSRF attacks
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

// Export this function to use in other files
// Makes it async because we're doing database operations (they take time)
// req contains user's data, res is what we send back

export const signup = async (req, res) => {
  // pull out the email, password, and name from the data user sent
  // this is called object destructuring cleaner than writing req.body.email, req.body.password, req.body.name
  const { email, password, name } = req.body;

  try {
    // check if user with that email already exists
    // await because database queries takes time
    // findOne returns the first match or null if no match
    const userExists = await User.findOne({ email });

    // if we find a user with that email
    if (userExists) {
      // stop here and send error message
      // status 400 means bad request (user's fault)
      // return prevents the code from running further
      return res.status(400).json({
        error: "User with that email already exists",
      });
    }

    // if we get here it means user with that email doesn't exist
    // create a new user in the database with provided info
    // await because database operations take time

    const user = await User.create({
      name,
      email,
      password,
    });

    // authenticate
    const { accessToken, refreshToken } = generateToken(user._id);
    await storeRefreshToken(user._id, refreshToken);

    setCookies(res, accessToken, refreshToken);

    // Send success response
    // Status 201 = Created (perfect for new resources)
    // Send back the created user object

    res.status(201).json({
      success: true,
      message: "User Created Successfully",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

    // if anything goes wrong in the try block (like database connection error)
  } catch (error) {
    // status 500 means server error (our fault, not users)
    // send back whatever error we got
    res.status(500).json({
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      const { accessToken, refreshToken } = generateToken(user._id);

      await storeRefreshToken(user._id, refreshToken);
      setCookies(res, accessToken, refreshToken);

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    }
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN);
      await redis.del(`refreshToken:${decoded.userId}`);
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// this controller is used to refresh the access token
export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN);
    const storedToken = await redis.get(`refreshToken:${decoded.userId}`);

    if (storedToken !== refreshToken) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const accessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.ACCESS_TOKEN,
      {
        expiresIn: "15m",
      }
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 15 * 60 * 1000,
    });

    res.json({ message: "Token refreshed successfully" });
  } catch (error) {
    console.log("Error in refreshToken controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    console.log("Error in getProfile controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
