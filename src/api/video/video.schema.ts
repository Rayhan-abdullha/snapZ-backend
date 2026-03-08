import { z } from "zod";

export const createVideoSchema = z.object({
  body: z.object({
    title: z.string().min(5),
    url: z.string().url(),
    category: z.string(),
    tags: z.array(z.string()).optional(),
    isLive: z.boolean().default(false),
  }),
});
export const createCommentSchema = z.object({
  body: z.object({
    message: z.string().min(1, "Comment cannot be empty"),
    postId: z.string().optional(),
    videoId: z.string().optional(),
    parentId: z.string().nullable().optional(),
  }).refine(
    (data) => data.postId || data.videoId,
    {
      message: "Comment must belong to either a Post or a Video",
      path: ["postId"],
    }
  ),
});
export const toggleLikeSchema = z.object({
  body: z.object({
    postId: z.string().optional(),
    videoId: z.string().optional(),
  }).refine(data => data.postId || data.videoId, {
    message: "Like must target either a Post or a Video",
  }),
});