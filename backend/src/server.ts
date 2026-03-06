import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import { userRouter } from "./routers/auth.route";
import { IApiError } from "./utils/apiError";
import { courseRouter } from "./routers/course.route";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(cookieParser());

// Routes:
// userRoutes:
app.use("/api/v1/users", userRouter);
// courseRoutes:
app.use("/api/v1/courses", courseRouter);

app.use((err: IApiError, req: Request, res: Response, next: NextFunction) => {
  console.log(err.stack);
  err.statusCode = err.statusCode ? err.statusCode : 500;
  err.message = err ? err.message.toString() : "Something went wrong";
  res.status(err.statusCode).json({
    status: `${err.statusCode}`,
    message: err.message,
  });
});

app.get("/", (req: Request, res: Response) => {
  res.send("hello its's working");
});

app.listen(PORT, () => console.log(`server is listing in port ${PORT}`));
