import express from "express";
import {
  grantRoleTeacher,
  handleUserLogin,
  handleUserSignUp,
} from "../controllers/auth.controller";
import { authorizedAdmin, verifyJWT } from "../middlewares/auth.middleware";

export const userRouter = express.Router();

userRouter.post("/signup", handleUserSignUp);
userRouter.post("/login", handleUserLogin);
userRouter.patch(
  "/users/grant/:id",
  verifyJWT,
  authorizedAdmin,
  grantRoleTeacher,
);
