import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

class CourseService {
  // কোর্স তৈরি
  async createCourse(data: any) {
    return await prisma.course.create({ data });
  }

  // সেকশন এবং লেসন একসাথে আপডেট বা তৈরি (Upsert Logic)
  async updateCourseContent(courseId: string, sections: any[]) {
    // এটি ডাইনামিক এডিটিং এর জন্য সবচেয়ে পাওয়ারফুল মেথড
    for (const section of sections) {
      const upsertedSection = await prisma.section.upsert({
        where: { id: section.id || 'new-id' },
        update: { title: section.title },
        create: { title: section.title, courseId },
      });

      for (const lesson of section.lessons) {
        await prisma.lesson.upsert({
          where: { id: lesson.id || 'new-id' },
          update: { 
            title: lesson.title, 
            videoUrl: lesson.videoUrl, 
            duration: lesson.duration 
          },
          create: { ...lesson, sectionId: upsertedSection.id },
        });
      }
    }
    return { success: true };
  }

  // এনরোলমেন্ট
  async enrollInCourse(userId: string, courseId: string) {
    return await prisma.enrollment.create({
      data: { userId, courseId }
    });
  }
  async getAllCourses() {
    return await prisma.course.findMany({
      include: {
        sections: {
          include: {
            lessons: true,
          },
        },
      
        enrollments: {
          select: {
            id: true,
            userId: true
          }
        }
      },
    });
  }
  async myEnrollments(userId: string) {
    return await prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          include: {
            sections: {
              include: {
                lessons: true,
              },
            },
          },
        },
      },
    })
  }
  async getSingleCourse(id: string) {
    return await prisma.course.findUnique({
      where: { id },
      include: {
        sections: {
          include: {
            lessons: true,
          },
        },
      },
    });
  }
  // কোর্স এবং কন্টেন্ট ডিলিট
  async deleteCourse(id: string) {
    await prisma.enrollment.deleteMany({ where: { courseId: id } });
    await prisma.section.deleteMany({ where: { courseId: id } });
    await prisma.lesson.deleteMany({ where: { sectionId: id } });
    await prisma.course.delete({ where: { id } });
  }

}

export default new CourseService();