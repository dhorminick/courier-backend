import { type Response, type Request } from "express";
import { compareSync, hashSync } from "bcrypt";
import { genRand, validate, createToken } from "../utils/index.js";

import { user as USER } from "../schema/user.schema.js";
import { type AuthRequest } from "../middleware/auth.js";

// # auth
export const Login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (
      !validate(email, res, "Email Address") ||
      !validate(password, res, "Password")
    ) {
      return;
    }

    const user = await USER.findOne({ email: email });
    if (!user) {
      return res.status(400).json({
        message: "User Error",
      });
    }

    if (!compareSync(password, user.password)) {
      return res.status(400).json({ message: "User Credentials Error" });
    }

    return res
      .status(200)
      .json({ message: `Welcome Back, ${user.name}`, id: user.id });
  } catch (error) {
    res.status(500).json({ message: "An error occured", error: error });
  }
};
export const SignUp = async (req: Request, res: Response) => {
  try {
    const { name, password, email } = req.body;

    if (
      !validate(name, res, "Username") ||
      !validate(password, res, "Password") ||
      !validate(email, res, "Email Address")
    ) {
      return;
    }
    const userID = `USER-${genRand(10).toUpperCase()}`;

    const newUser = new USER({
      id: userID,
      name: name,
      password: hashSync(password, 10),
      email: email,
    });

    const user = await newUser.save();

    if (!user) {
      return res.status(400).json({ message: "Error Signing Up" });
    }

    return res.status(200).json({
      message: `Welcome, ${name}`,
      //   token: createToken(userID),
      id: userID,
    });
  } catch (error) {
    res.status(500).json({ message: "An error occured", error: error });
  }
};
