import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";

export const requestEnrollment = asyncHandler(
  async (req: Request, res: Response) => {
    const { code } = req.body;

    if (!req.user) throw new ApiError(401, "Unauthorized");

    const studentId = req.user.id;

    const course = await prisma.course.findUnique({
      where: { code },
    });

    if (!course) throw new ApiError(404, "Course not found");

    const exist = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: studentId,
          courseId: course.id,
        },
      },
    });

    if (exist) throw new ApiError(400, "Already requested");

    const request = await prisma.enrollment.create({
      data: {
        userId: studentId,
        courseId: course.id,
        status: "PENDING",
      },
    });

    res.status(201).json({
      success: true,
      data: request,
    });
  },
);
