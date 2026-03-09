import { PrismaClient, UserRole } from "@prisma/client";
import { Post } from "../../types";
const prisma = new PrismaClient();

class PostService {
  // Create editorial post
async createPost(userId: string, role: string, data: Post) {
  // Check role-based requirement
  if (role === UserRole.USER && !data.content && !data.blocks) {
    throw new Error("content or blocks is required for users");
  }

  // Validate mutually exclusive fields
  if (data.content && data.blocks) {
    throw new Error("Cannot provide both content and blocks at the same time");
  }

  if (!data.content && !data.blocks) {
    throw new Error("Either content or blocks must be provided");
  }

  const newPost: any = {
    authorId: userId,
    title: data.title,
    slug: data.slug,
    category: data.category,
    coverImage: data.coverImage,
    content: data.content ?? null,
    blocks: data.blocks ?? null,
  };

  return await prisma.post.create({
    data: newPost,
  });
}
  // Fetch Feed (Posts + Videos)
  async getAllPosts() {
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
    return { posts, videos };
  }
  async getFeed() {
    const posts = await prisma.post.findMany({
      where: { status: 'PUBLISHED' },
      include: { author: true, _count: { select: { comments: true, likes: true } } },
      orderBy: { createdAt: 'desc' }
    });
    
    const videos = await prisma.video.findMany({
      where: { status: 'PUBLISHED' },
      include: { author: true, _count: { select: { comments: true, likes: true } } },
      orderBy: { createdAt: 'desc' }
    });
    return { posts, videos, liveTv: await this.getLiveTv() };
  }
  async getMyPosts(userId: string) {
    const posts = await prisma.post.findMany({
      where: { authorId: userId },
      include: { author: true, _count: { select: { comments: true, likes: true } } },
      orderBy: { createdAt: 'desc' }
    });

    const videos = await prisma.video.findMany({
      where: { authorId: userId },
      include: { author: true, _count: { select: { comments: true, likes: true } } },
      orderBy: { createdAt: 'desc' }
    })
    return {
      posts,
      videos
    }
  }
  async deletePost(param: string, type: string) {
    if (type === 'post') {
      return await prisma.post.delete({ where: { slug: param } });
    }
    if (type === 'video') {
      return await prisma.video.delete({ where: { id: param } });
    }
    return null;
  }
  async getSingleArticle(slug: string) {
    return await prisma.post.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            name: true
          }
        },
        _count: {
          select: {
            comments: true,
            likes: true
          }
        }
      }
    });
  }
  async addBookmarks(userId: string, postId: string, type: "post" | "video") {
    const bookmark = await prisma.bookmark.findFirst({
      where: {
        userId,
        [type === 'post' ? 'postId' : 'videoId']: postId
      }
    })

    if (bookmark) {
      throw new Error('Bookmark already exists');
    }
    if (type === 'post') {
      return await prisma.bookmark.create({
        data: {
          userId,
          postId,
        }
      })
    }
    if (type === 'video') {
      return await prisma.bookmark.create({
        data: {
          userId,
          videoId: postId,
        }
      })
    }
    return null
  }
  async getBookmarks(userId: string) {
    const bookmarks = await prisma.bookmark.findMany({
      where: { userId }
    });
    if (bookmarks) {
      const postIds = bookmarks.map((bookmark) => bookmark.postId).filter((id) => id !== null);
      const videoIds = bookmarks.map((bookmark) => bookmark.videoId).filter((id) => id !== null);
      const posts = await prisma.post.findMany({
        where: {
          id: { in: postIds }
        },
        include: {
          author: {
            select: {
              id: true,
              name: true
            }
          },
          _count: {
            select: {
              comments: true,
              likes: true
            }
          }
        }
      });
      const videos = await prisma.video.findMany({
        where: {
          id: { in: videoIds }
        },
        include: {
          author: {
            select: {
              id: true,
              name: true
            }
          },
          _count: {
            select: {
              comments: true,
              likes: true
            }
          }
        }
      });
      return { posts, videos };
    }
    return null
  }
  async removeBookmark(userId: string, postId: string, type: "post" | "video") {
    if (type === 'post') {
      return await prisma.bookmark.deleteMany({
        where: {
          userId,
          postId
        }
      });
    }
    if (type === 'video') {
      return await prisma.bookmark.deleteMany({ where: { userId, videoId: postId } });
    }
    return null
  }

  // Fetch Live Channels only
  async getLiveTv() {
    return await prisma.video.findMany({
      where: { isLive: true, status: 'PUBLISHED' }
    });
  }
}

export default new PostService();