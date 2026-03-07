import express from "express";

import { requestEnrollment } from "../controllers/requestEnroll.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

export const reqEnrollRouter = express.Router();

reqEnrollRouter.post("/join", verifyJWT, requestEnrollment);
