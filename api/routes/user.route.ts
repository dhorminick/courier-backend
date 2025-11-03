import { Router } from "express";
import { Login, SignUp } from "../controllers/user.controller.js";
import { authenticate } from "../middleware/auth.js";

const user: Router = Router();

// # Auth
user.post("/sign-in", Login);
user.post("/sign-up", SignUp);

export default user;
