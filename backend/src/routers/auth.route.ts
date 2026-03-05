import express from "express";
import {
  handleUserLogin,
  handleUserSignUp,
} from "../controllers/auth.controller";

export const userRouter = express.Router();

userRouter.post("/signup", handleUserSignUp);
userRouter.post("/login", handleUserLogin);
