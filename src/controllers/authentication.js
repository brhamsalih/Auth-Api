import {
  getUsersByEmail,
  getUsersById,
  createUser,
} from "../db/users.js";
import {
  random,
  authentication,
  authorization,
  refreshAuthorization,
  resetToken,
} from "../middleware/auth.js";
import sendEmail from "../middleware/sendEmail.js";
import dotenv from "dotenv";
import { Token } from "../models/token.js";
import jwt from "jsonwebtoken";

dotenv.config({ path: ".env" });
const refreshTokenSecret = process.env.REFRESH_TOKEN_KEY;

//handler logining
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.sendStatus(400);
    }
    const user = await getUsersByEmail(email).select(
      "+authentication.salt +authentication.password"
    );
    if (!user) {
      return res.sendStatus(400);
    }
    const expectedHash = authentication(user.authentication.salt, password);
    if (user.authentication.password != expectedHash) {
      return res.sendStatus(403);
    }

    const accessToken = authorization(user._id, user.username, user.role);
    const refreshToken = refreshAuthorization(
      user._id,
      user.username,
      user.role
    );
    const token = new Token({ token: refreshToken, userId: user._id });
    await token.save();
    // user.authentication.accessToken = accessToken;
    // user.authentication.refreshToken = refreshToken;
    // await user.save();
    res.cookie("IBRAHIM-AUTH", accessToken, {
      domain: "localhost",
      path: "/",
    });
    return res
      .status(200)
      .json({ Message: "Login Seccess", RefreshToken: refreshToken })
      .end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
// create refresh token
export const token = async (req, res) => {
  try {
    // const sessionToken = req.cookies["IBRAHIM-AUTH"];
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).send("Access Denied");
    }
    const storedToken = await Token.findOne({ token });
    if (!storedToken) {
      return res.status(403).send("Invalid refresh token");
    }
    jwt.verify(token, refreshTokenSecret, (err, user) => {
      if (err) {
        return res.status(403).send("Invalid refresh token");
      }
      const newAccessToken = authorization(user._id, user.username, user.role);
      res.json({
        accessToken: newAccessToken,
      });
    });
  } catch (error) {
    console.log(error);
    res.status(401).send({ error: "Invalid token." });
  }
};
//handler registeration
export const register = async (req, res) => {
  try {
    const { email, password, username, role } = req.body;
    if (!email || !password || !username) {
      return res.sendStatus(400);
    }
    const existingUser = await getUsersByEmail(email);
    if (existingUser) {
      return res.sendStatus(400);
    }
    const salt = random();
    const user = await createUser({
      email,
      username,
      authentication: {
        salt,
        password: authentication(salt, password),
      },
      role,
    });
    return res.status(200).json(user).end();
  } catch (error) {
    return res.sendStatus(400);
  }
};

export const logout = async (req, res) => {
  try {
    const { token } = req.body;

    if (typeof token !== "string") {
      return res.status(400).send("Invalid token format");
    }
    await Token.findOneAndDelete({ token });
    return res.status(204).json({ message: "Logout successful" });
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

//handler reset password
export const resetPasswordRequest = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.sendStatus(400);
    }
    const existingUser = await getUsersByEmail(email).select(
      "+authentication.salt +authentication.password"
    );
    if (!existingUser) {
      return res.sendStatus(400);
    }

    const token = resetToken(existingUser._id, existingUser.role);
    existingUser.authentication.resetPasswordToken = token;
    await existingUser.save();
    const resetUrl = `http://localhost:3000/reset-password/${token}`;
    const message = `You are receiving this email because you (or someone else) has requested a password reset.
                     Please make sure is you then follwing this link to reset your password: \n\n ${resetUrl}`;
    await sendEmail(
      existingUser.username,
      email,
      "Password Reset Request",
      message
    );
    return res.status(200).json({ msg: "Password reset email sent" });
  } catch (error) {
    // existingUser.authentication.resetPasswordToken = undefined;
    // existingUser.authentication.resetPasswordExpires = undefined;
    // await existingUser.save();
    console.log(error);
    return res.status(500).send("Error sending email");
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const id = req.userId;
    const user = await getUsersById(id);
    const salt = random();
    user.authentication.salt = salt;
    user.authentication.password = authentication(salt, password);
    user.authentication.resetPasswordToken = undefined;
    await user.save();
    return res.status(200).send({ msg: "Password has been reset" });
  } catch (error) {
    console.log(error);
    return res.status(401).send("Error reset password");
  }
};
