import {
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
} from "../controllers/users.js";
import { isAuthenticated, isOwner, isOwnerAdmin } from "../middleware/auth.js";

export default (router) => {
  router.get("/users", isAuthenticated, isOwnerAdmin, getAllUsers);
  router.get("/users/:id", isAuthenticated, isOwner, getUser);
  router.delete("/users/:id", isAuthenticated, isOwner, deleteUser);
  router.patch("/users/:id", isAuthenticated, isOwner, updateUser);
};
