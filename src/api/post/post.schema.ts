import { z } from "zod";

export const createPostSchema = z.object({
  body: z.object({
    title: z.string().min(5, "Title is too short"),
    slug: z.string().min(1),
    category: z.string(),
    coverImage: z.string().url(),
    content: z.string().optional(),
    blocks: z.any().optional(), // For JSON blocks
  }),
});

export const createVideoSchema = z.object({
  body: z.object({
    title: z.string().min(5),
    url: z.string().url("Invalid video URL"),
    category: z.string(),
    tags: z.array(z.string()).default([]),
    isLive: z.boolean().default(false),
  }),
});
export default { createPostSchema, createVideoSchema };