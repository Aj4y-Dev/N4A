import express from "express";
import {
  handleUserLogin,
  handleUserSignUp,
} from "../controllers/auth.controller";

export const userRouter = express.Router();

userRouter.post("/user/signup", handleUserSignUp);
userRouter.post("/user/login", handleUserLogin);
