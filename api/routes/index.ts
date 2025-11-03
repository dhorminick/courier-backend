import { Router } from "express";
// import courier from "./courier.route.js";
import user from "./user.route.js";

const RootRoutes: Router = Router();

// RootRoutes.use("/courier", courier);
RootRoutes.use("/user", user);

export default RootRoutes;
