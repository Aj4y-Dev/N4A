import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import { userRouter } from "./routers/auth.route";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());

app.use("/api/v1", userRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("hello its's working");
});

app.listen(PORT, () => console.log(`server is listing in port ${PORT}`));
