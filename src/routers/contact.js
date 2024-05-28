import { contactMe } from "../controllers/contactMe.js";
export default (router) => {
  router.post("/contact", contactMe);
};
