import { z } from "zod";

export const createCourseSchema = z.object({
  body: z.object({
    title: z.string().min(3, "Title is too short"),
    instructor: z.string().min(2, "Instructor name is required"),
    category: z.string(),
    price: z.number().nonnegative(),
    thumbnail: z.string(),
  }),
});

export const createSectionSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Section title is required"),
    courseId: z.string(),
  }),
});

export const lessonSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Lesson title is required"),
    videoUrl: z.string(),
    duration: z.string(),
    sectionId: z.string(),
  }),
});

export const enrollSchema = z.object({
  body: z.object({
    courseId: z.string(),
  }),
});