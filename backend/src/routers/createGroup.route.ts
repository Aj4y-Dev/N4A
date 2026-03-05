import express from "express";
import {
  getAllGroups,
  handleCreateGroup,
} from "../controllers/createGroup.controller";

export const createGroupRouter = express.Router();

createGroupRouter.post("/courses", handleCreateGroup);
createGroupRouter.get("/courses/getAll", getAllGroups);
