import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const handleUserSignUp = async (req: Request, res: Response) => {
  try {
    const { email, username, password } = req.body || {};

    if (!email || !username || !password) {
      return res
        .status(400)
        .json({ status: false, message: "All filed required" });
    }

    const existUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existUser) {
      return res
        .status(400)
        .json({ status: false, message: "email Already exist" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
      },
    });

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "7d",
      },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, //true in production
    });

    // Remove the password field from the user object before sending response
    const { password: _, ...userWithoutPassword } = user;

    return res.status(201).json({
      success: true,
      message: "Registration created successfully",
      data: userWithoutPassword,
    });
  } catch (error) {
    console.log("error in handleUserSignup", error);
    return res
      .status(500)
      .json({ status: false, message: "internal server error" });
  }
};

export const handleUserLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ status: false, message: "All filed required" });
    }

    const existUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!existUser) {
      return res
        .status(400)
        .json({ status: false, message: "email Already exist" });
    }

    // check Hash password
    const isMatch = await bcrypt.compare(password, existUser.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ status: false, message: "Incorrect username or password" });
    }

    const token = jwt.sign(
      {
        id: existUser.id,
        username: existUser.username,
        role: existUser.role,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "7d",
      },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, //true in production
    });

    // Remove the password field from the user object before sending response
    const { password: _, ...userWithoutPassword } = existUser;

    return res.status(201).json({
      success: true,
      message: "Login successfully",
      data: userWithoutPassword,
    });
  } catch (error) {
    console.log("error in handleUserLogin", error);
    return res
      .status(500)
      .json({ status: false, message: "internal server error" });
  }
};
