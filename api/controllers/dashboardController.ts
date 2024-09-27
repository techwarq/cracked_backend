import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getDashboardMetrics = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Fetch solved questions with limit
    const solvedQuestions = await prisma.question.findMany({
      take: 10,
      where: { isSolved: true },
    });

    // Fetch all topics with related questions
    const topics = await prisma.topic.findMany({
      include: {
        questions: true, // Include related questions
      },
    });

    // Determine completed topics (where all questions are solved)
    const completedTopicsCount = topics.filter(topic => 
      topic.questions.every(question => question.isSolved)
    ).length;

    // Count of solved questions
    const solvedQuestionsCount = await prisma.question.count({
      where: { isSolved: true },
    });

    // Count of all topics
    const topicsCount = await prisma.topic.count();

    // Count of all questions
    const questionsCount = await prisma.question.count();

    // Progress chart (pie chart data)
    const totalQuestions = await prisma.question.count();
    const unsolvedQuestionsCount = totalQuestions - solvedQuestionsCount;

    const progressData = [
      { category: "Solved", value: solvedQuestionsCount },
      { category: "Unsolved", value: unsolvedQuestionsCount },
    ];

    // Send the response
    res.status(200).json({
      solvedQuestionsCount,
      topicsCount,
      solvedQuestions,
      progressData,
      completedTopicsCount,
      questionsCount,
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: "Error retrieving dashboard metrics" });
  } finally {
    await prisma.$disconnect(); // Disconnect from Prisma client
  }
};
