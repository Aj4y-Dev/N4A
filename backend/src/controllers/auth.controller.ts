import { CookieOptions, Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";

const generateAccessAndRefreshToken: (userId: string) => Promise<{
  accessToken: string;
  refreshToken: string;
}> = async (userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) throw new ApiError(400, "User with provided email not found");

  const accessToken = jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
    },
    process.env.ACCESS_TOKEN_SECRET as string,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY as string },
  );
  const refreshToken = jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
    },
    process.env.REFRESH_TOKEN_SECRET as string,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY as string },
  );

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken },
  });

  return { accessToken, refreshToken };
};

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

export const handleUserLogin = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password)
      throw new ApiError(400, "Email and Password are required...");

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!existingUser)
      throw new ApiError(400, "User with provided email doesn't exist");

    // check Hash password
    const isMatch = await bcrypt.compare(password, existingUser.password);

    if (!isMatch) throw new ApiError(400, "Incorrect email or password");

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      existingUser.id,
    );

    const options: CookieOptions = {
      httpOnly: true,
      secure: false, //true in development
      sameSite: "strict",
    };

    // Remove the password field from the user object before sending response
    const { password: _, ...userWithoutPassword } = existingUser;

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        success: true,
        message: "Login successfully",
        data: userWithoutPassword,
      });
  },
);
