import { z } from "zod";

export const createPostSchema = z.object({
  body: z.object({
    // title can be optional, but if provided, must be at least 5 characters
    title: z.string().optional(),
    slug: z.string().min(1),
    category: z.string(),
    coverImage: z.string().url().optional(),
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