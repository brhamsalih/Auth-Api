import {
  login,
  register,
  token,
  logout,
  resetPasswordRequest,
  resetPassword,
} from "../controllers/authentication.js";
import { isResetTokenAuth } from "../middleware/auth.js";

export default (router) => {
  router.post("/auth/register", register);
  router.post("/auth/login", login);
  router.post("/auth/logout", logout);
  router.post("/auth/token", token);
  router.post("/auth/reset-password-request", resetPasswordRequest);
  router.post("/auth/reset-password/:token", isResetTokenAuth, resetPassword);
};
