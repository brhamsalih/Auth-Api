import { deleteUserById, getUsers, getUsersById } from "../db/users.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await getUsers();
    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
//get student by id
export const getUser = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await getUsersById(id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500);
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteUser = await deleteUserById(id);
    return res.json(deleteUser);
  } catch (error) {
    console.log(error);
    res.status(400);
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username } = req.body;
    if (!username) {
      return res.sendStatus(400);
    }

    const user = await getUsersById(id);
    if (!user) {
      return res.sendStatus(400);
    }
    user.username = username;
    await user.save();

    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};
