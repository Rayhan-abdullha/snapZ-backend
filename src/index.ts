import config from 'config';
import { server } from './app/app';
import { PrismaClient } from "@prisma/client";

const PORT = config.get('port');


server.listen(PORT, () => {

const prisma = new PrismaClient();

async function testConnection() {
  try {
    await prisma.$connect();
    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
  console.log(`http://localhost:${PORT}`);
});
