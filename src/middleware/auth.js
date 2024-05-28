import crypto from "crypto";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config({ path: ".env" });
const SECRET = process.env.ACCESS_TOKEN_KEY;
const refreshTokenSecret = process.env.REFRESH_TOKEN_KEY;
const expiresIn = process.env.EXPIRES_DATE;
const refreshExpiresIn = process.env.REFRESH_EXPIRES_DATE;
const expireResetToken = process.env.EXPIRES_DATE_RESET_TOKEN;

// create reset token with expire
export const resetToken = (id, role) => {
  return jwt.sign({ id, role }, SECRET, {
    expiresIn: expireResetToken,
  });
};
export const isResetTokenAuth = async (req, res, next) => {
  try {
    const { token } = req.params;
    if (!token) {
      return res.status(401).send("Access Denied");
    }
    console.log(token);
    const verified = jwt.verify(token, SECRET);
    if (!verified) {
      return res.sendStatus(403).send("Not Alowed");
    }
    req.userId = verified.id;
    req.userRole = verified.role;
    return next();
  } catch (error) {
    console.log(error);
    res.status(401).send({ error: "Invalid token." });
  }
};
// create random hash and encrypt password with salt
export const random = () => crypto.randomBytes(128).toString("base64");
export const authentication = (salt, password) => {
  return crypto
    .createHmac("sha256", [salt, password].join("/"))
    .update(SECRET)
    .digest("hex");
};
// create access token
export const authorization = (id, username, role) => {
  return jwt.sign({ id, username, role }, SECRET, {
    expiresIn,
  });
};
// create refresh token
export const refreshAuthorization = (id, username, role) => {
  return jwt.sign({ id, username, role }, refreshTokenSecret, {
    expiresIn: refreshExpiresIn,
  });
};
// check if user session valid and not expired
export const isAuthenticated = async (req, res, next) => {
  try {
    // const sessionToken = req.cookies["IBRAHIM-AUTH"];
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).send("Access Denied");
    }
    const verified = jwt.verify(token, SECRET);
    if (!verified) {
      return res.sendStatus(403).send("Not Alowed");
    }
    req.userId = verified.id;
    req.userRole = verified.role;
    return next();
  } catch (error) {
    res.status(401).send({ error: "Invalid token." });
  }
};
// check if user session is same owner id
export const isOwner = async (req, res, next) => {
  try {
    const { id } = req.params;
    const currnetUserId = req.userId;
    if (!currnetUserId) {
      return res.sendStatus(403);
    }
    if (currnetUserId.toString() != id) {
      return res.sendStatus(403);
    }
    next();
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

// check if user session is same owner id
export const isOwnerAdmin = async (req, res, next) => {
  try {
    const currnetUserIdRole = req.userRole;

    if (currnetUserIdRole.toString() !== "admin") {
      return res.sendStatus(403);
    }
    next();
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};
