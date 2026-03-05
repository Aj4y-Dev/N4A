import express from "express";
import {
  getAllGroups,
  handleCreateGroup,
} from "../controllers/createGroup.controller";
import {
  verifyJWT,
  authorizedTeacher,
} from "../middlewares/auth.middleware.js";

export const createGroupRouter = express.Router();

createGroupRouter.post("/", verifyJWT, authorizedTeacher, handleCreateGroup);
createGroupRouter.get("/", verifyJWT, authorizedTeacher, getAllGroups);
