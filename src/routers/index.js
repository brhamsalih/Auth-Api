import express from "express";
import authentication from "./authentication.js";
import users from "./users.js";
import contact from "./contact.js";
const router = express.Router();

export default () => {
  authentication(router);
  users(router);
  contact(router);
  return router;
};
