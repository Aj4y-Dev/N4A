import express from "express";
import {
  getAllCourses,
  createCourse,
  getEnrollmentRequests,
  approveEnrollment,
  rejectEnrollment,
} from "../controllers/course.controller";
import {
  verifyJWT,
  authorizedTeacher,
} from "../middlewares/auth.middleware.js";

export const courseRouter = express.Router();

courseRouter.post("/", verifyJWT, authorizedTeacher, createCourse);
courseRouter.get("/", verifyJWT, authorizedTeacher, getAllCourses);
courseRouter.get(
  "/request",
  verifyJWT,
  authorizedTeacher,
  getEnrollmentRequests,
);
courseRouter.patch(
  "/enrollment/approve",
  verifyJWT,
  authorizedTeacher,
  approveEnrollment,
);
courseRouter.patch(
  "/enrollment/reject",
  verifyJWT,
  authorizedTeacher,
  rejectEnrollment,
);
