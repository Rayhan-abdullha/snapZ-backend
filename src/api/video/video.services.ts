import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

class ContentService {
  // Create Video Reel
  async createVideo(userId: string, data: any) {
    return await prisma.video.create({
      data: { ...data, authorId: userId },
    });
  }

  // Create Comment (supports replies)
async createComment(userId: string, data: any) {
  return await prisma.comment.create({
    data: {
      message: data.message,
      authorId: userId,
      postId: data.postId || null,
      videoId: data.videoId || null,
      parentId: data.parentId || null
    },
    include: {
      author: {
        select: {
          id: true,
          name: true
        }
      }
    }
  });
}
  async getPostComments(postId: string, type: string) {
    const comments = await prisma.comment.findMany({
      where: {
        // condintion by type if type == 'video' then videoId == videoId else postId == postId
        [type === "video" ? "videoId" : "postId"]: postId,
        parentId: null
      },

      include: {
        post: {
          select: {
            id: true,
            _count: true
          }
        },
        video: {
          select: {
            id: true,
            _count: true
          }
        },

        author: {
          select: {
            id: true,
            name: true
          }
        },

        replies: {
          include: {
            author: {
              select: {
                id: true,
                name: true
              }
            }
          },
          orderBy: {
            createdAt: "asc"
          }
        }
      },

      orderBy: {
        createdAt: "desc"
      }
    });

  return comments;
}
  // Toggle Like (Like/Unlike logic)
  async toggleLike(userId: string, target: { postId?: string; videoId?: string }) {
    const existingLike = await prisma.like.findFirst({
      where: {
        userId,
        AND: [
          { postId: target.postId || null },
          { videoId: target.videoId || null }
        ]
      },
    });

    if (existingLike) {
      await prisma.like.delete({ where: { id: existingLike.id } });
      return { liked: false };
    }

    await prisma.like.create({
      data: {
        userId,
        postId: target.postId || null,
        videoId: target.videoId || null,
      },
    });
    return { liked: true };
  }
}

export default new ContentService();