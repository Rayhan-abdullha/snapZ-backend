import { z } from "zod";

export const createConversationSchema = z.object({
  body: z.object({
    // যদি আপনার আইডি UUID হয় তবে .uuid() যোগ করুন, নয়তো .min(1) রাখা নিরাপদ
    receiverId: z.string({
      required_error: "Receiver identity is required",
    }).min(1, "Invalid Receiver ID"),
  }),
});

export const sendMessageSchema = z.object({
  body: z.object({
    conversationId: z.string({
      required_error: "Conversation context is missing",
    }).min(1),
    receiverId: z.string({
      required_error: "Recipient is required",
    }).min(1),
    text: z.string()
      .trim() // অতিরিক্ত স্পেস রিমুভ করবে
      .min(1, "Message cannot be empty")
      .max(1000, "Message is too long"), // সিকিউরিটির জন্য লিমিট থাকা ভালো
  }),
});

export default {
  createConversationSchema,
  sendMessageSchema
};