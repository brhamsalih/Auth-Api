import { UserModel } from "../models/users.js";
import { Token } from "../models/token.js";

//access data users
export const getUsers = () => UserModel.find();
export const getUsersByEmail = (email) => UserModel.findOne({ email });
export const getUser = (token) =>
  UserModel.findOne({
    "authentication.resetPasswordToken": token,
  });
// export const getUsersBySessionToken = (sessionToken) =>
//   UserModel.findOne({ "authentication.refreshToken": sessionToken });
export const getUsersById = (id) => UserModel.findOne({ _id: id });

//CRUD data users
export const createUser = (values) =>
  new UserModel(values).save().then((user) => user.toObject());
export const deleteUserById = (id) => UserModel.findByIdAndDelete({ _id: id });
export const UpdateUserById = (id, values) =>
  UserModel.findByIdAndUpdate({ _id: id, values });

// Token Models
export const deleteToken = (token) => Token.findOneAndDelete({ token });
export const storedToken = (token) => Token.findOne({ token });
