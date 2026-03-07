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

export const getEnrollmentRequests = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) throw new ApiError(401, "Unauthorized");

    const teacherId = req.user.id;

    const requests = await prisma.enrollment.findMany({
      where: {
        status: "PENDING",
        course: {
          teacherId,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        course: true,
      },
    });

    res.status(200).json({
      success: true,
      data: requests,
    });
  },
);

export const approveEnrollment = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId, courseId } = req.body;

    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }

    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
      include: {
        course: true,
      },
    });

    if (!enrollment) {
      throw new ApiError(404, "Enrollment request not found");
    }

    if (enrollment.course.teacherId !== req.user.id) {
      throw new ApiError(403, "Not allowed");
    }

    const updated = await prisma.enrollment.update({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
      data: {
        status: "APPROVED",
      },
    });

    res.status(200).json({
      success: true,
      data: updated,
    });
  },
);

export const rejectEnrollment = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId, courseId } = req.body;

    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }

    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
      include: {
        course: true,
      },
    });

    if (!enrollment) {
      throw new ApiError(404, "Enrollment request not found");
    }

    if (enrollment.course.teacherId !== req.user.id) {
      throw new ApiError(403, "Not allowed");
    }

    const updated = await prisma.enrollment.update({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
      data: {
        status: "REJECTED",
      },
    });

    res.status(200).json({
      success: true,
      data: updated,
    });
  },
);
