import express from "express";
import { getAllCourses, createCourse } from "../controllers/course.controller";
import {
  verifyJWT,
  authorizedTeacher,
} from "../middlewares/auth.middleware.js";

export const courseRouter = express.Router();

courseRouter.post("/", verifyJWT, authorizedTeacher, createCourse);
courseRouter.get("/", verifyJWT, authorizedTeacher, getAllCourses);
