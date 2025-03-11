//naming it auth.route.js instead of auth.js is only to be able to recognize
//just a convension

import express from "express";
import {
  login,
  logout,
  signup,
  getAuthUser,
} from "../controllers/auth.controller.js"; // auto imports
import { protectRoute } from "../middleware/auth.middleware.js";
const router = express.Router();

router.post("/signup", signup);
// this takes a path and a callback function (this callback function is written in controllers)
// when called (i.e. visited the /signup path). will execute the callback funtion
// .post instead of .get, because user posts their data to the backend when sineup
// post when writing to server, get when fetching from server
// post is not catch by browser, and not visible in URL

router.post("/login", login);

router.post("/logout", logout);

router.get("/me", protectRoute, getAuthUser);
// if user is authenticated, keep them , else if error then move then to login page

export default router; //this can be imported from other files now
//only one defult export is allowed per module
//so by using export default we are specifying that this is the main export
