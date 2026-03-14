import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class ConversationService {
  async createConversation(userId: string, receiverId: string) {

    const existing = await prisma.conversation.findFirst({
      where: {
        OR: [
          { user1Id: userId, user2Id: receiverId },
          { user1Id: receiverId, user2Id: userId }
        ]
      }
    });

    if (existing) return existing;

    return prisma.conversation.create({
      data: {
        user1Id: userId,
        user2Id: receiverId
      }
    });
  }

async getUserConversations(userId: string) {
  const conversations = await prisma.conversation.findMany({
    where: {
      OR: [
        { user1Id: userId },
        { user2Id: userId }
      ]
    },
    orderBy: { createdAt: "desc" }
  });

  const users = await prisma.user.findMany({
    where: {
      id: {
        in: conversations.flatMap(c => [c.user1Id, c.user2Id])
      }
    }
  });

  const result = conversations.map((conv) => {
    const user1 = users.find(u => u.id === conv.user1Id);
    const user2 = users.find(u => u.id === conv.user2Id);

    return {
      ...conv,
      user1: {
        id: user1?.id,
        name: user1?.name,
      },
      user2: {
        id: user2?.id,
        name: user2?.name
      }
    };
  });

  return result;
}

  async sendMessage(data: {
    conversationId: string;
    senderId: string;
    receiverId: string;
    text: string;
  }) {

    return prisma.message.create({
      data
    });
  }

  async getMessages(conversationId: string) {

    return prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" }
    });
  }
  async markSeen(conversationId: string) {
    return prisma.message.updateMany({
      where: {
        conversationId: conversationId,
        seen: false
      },
      data: {
        seen: true
      }
    });
  }

}

export default new ConversationService();