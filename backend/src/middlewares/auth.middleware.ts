import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";
import { ApiError } from "../utils/apiError.js";
import { Role } from "../../generated/prisma/index.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) throw new ApiError(401, "Unauthorized Request");

  const decodedToken = jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET as string,
  ) as Express.UserPayload;

  const user = await prisma.user.findUnique({
    where: { id: decodedToken.id },
    select: {
      id: true,
      email: true,
      username: true,
      role: true,
    },
  });

  if (!user) throw new ApiError(401, "Invalid Access Token");

  req.user = user;
  next();
});

export const authorizedTeacher = asyncHandler(async (req, res, next) => {
  if (!req.user || req.user.role !== Role.TEACHER) {
    throw new ApiError(403, "Forbidden : Teacher Only");
  }
  next();
});

export const authorizedAdmin = asyncHandler(async (req, res, next) => {
  if (!req.user || req.user.role !== Role.ADMIN) {
    throw new ApiError(403, "Forbidden : Admin Only");
  }
  next();
});
