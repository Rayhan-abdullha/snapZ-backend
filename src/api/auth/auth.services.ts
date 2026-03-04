import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../../../config/env";

const prisma = new PrismaClient();

class AuthService {
  async register(data: { name: string; email: string; password: string }) {
    const { name, email, password } = data;
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error("Email already in use");
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    return prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
  }
  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new Error("Invalid email or password");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user.id);

    const resUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      role: user.role,
      bio: user.bio,
    }

    return { accessToken, refreshToken, user: resUser };
  }
  async refreshToken(token: string) {
    try {
      const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!);

      const newAccessToken = this.generateAccessToken((payload as any).id);
      const newRefreshToken = this.generateRefreshToken((payload as any).id);

      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (error) {
      throw new Error("Invalid refresh token");
    }
  }
  async getAllUsers() {
    return await prisma.user.findMany();
  }
  async deleteUser(userId: string) {
    return await prisma.$transaction([
      prisma.post.deleteMany({
        where: { authorId: userId }
      }),

      prisma.video.deleteMany({
        where: { authorId: userId }
      }),

      prisma.user.delete({
        where: { id: userId }
      })
    ]);
  }
  async getProfile(userId: string) {
    return await prisma.user.findUnique({ where: { id: userId } });
  }
  generateAccessToken(user: any) {
    return jwt.sign({ id: user.id, role: user.role, email: user.email, name: user.name  }, config.secret_access_token || "my_secret_key", {
      expiresIn: "7d",
    });
  }
  generateRefreshToken(userId: string) {
    return jwt.sign({ id: userId }, config.secret_access_token || "my_secret_key", {
      expiresIn: "7d",
    });
  }
}

export default new AuthService();
