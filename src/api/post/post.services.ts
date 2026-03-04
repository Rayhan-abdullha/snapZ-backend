import { PrismaClient, UserRole } from "@prisma/client";
import { Post } from "../../types";
const prisma = new PrismaClient();

class PostService {
  // Create editorial post
  async createPost(userId: string, role: string, data: Post) {
    if (role === UserRole.USER && !data.content) {
      throw new Error("content is required");
    }
    if (role === UserRole.ADMIN && !data.blocks) {
      throw new Error("blocks is required");
    }
    const newPost: any = {
      authorId: userId,
      title: data.title,
      slug: data.slug,
      category: data.category,
      coverImage: data.coverImage,
    }
    if (role === UserRole.ADMIN) {
      newPost.blocks = data.blocks;
    } else {
      newPost.content = data.content;
    }
    return await prisma.post.create({
      data: { ...newPost },
    });
  }

  // Create Video / Live Reel
  async createVideo(userId: string, data: any) {
    return await prisma.video.create({
      data: { ...data, authorId: userId },
    });
  }

  // Fetch Feed (Posts + Videos)
  async getFeed() {
    const posts = await prisma.post.findMany({
      where: { status: 'PUBLISHED' },
      include: { author: true, _count: { select: { comments: true, likes: true } } },
      orderBy: { createdAt: 'desc' }
    });
    
    const videos = await prisma.video.findMany({
      where: { status: 'PUBLISHED' },
      include: { author: true },
      orderBy: { createdAt: 'desc' }
    });
    return { posts, videos, liveTv: await this.getLiveTv() };
  }

  async getSingleArticle(slug: string) {
    return await prisma.post.findUnique({ where: { slug }, include: { author: true } });
  }

  // Fetch Live Channels only
  async getLiveTv() {
    return await prisma.video.findMany({
      where: { isLive: true, status: 'PUBLISHED' }
    });
  }
}

export default new PostService();