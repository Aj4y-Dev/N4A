//this can be done by only teacher
import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";

export const createCourse = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, code, description } = req.body;

    if (!name || !code) {
      throw new ApiError(400, "All field are required...");
    }

    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }

    const existCode = await prisma.course.findUnique({
      where: { code },
    });

    if (existCode) throw new ApiError(400, "Course code already exists");

    const teacherId = req.user.id;

    const course = await prisma.course.create({
      data: {
        name,
        code,
        description,
        teacherId,
      },
    });

    res.status(201).json({
      success: true,
      data: course,
    });
  },
);

export const getAllCourses = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }

    const teacherId = req.user?.id;

    const courses = await prisma.course.findMany({
      where: {
        isActive: true,
        teacherId,
      },
      include: {
        teacher: true,
      },
    });

    if (!courses.length) throw new ApiError(404, "No courses found");

    res.status(200).json({
      success: true,
      data: courses,
    });
  },
);
