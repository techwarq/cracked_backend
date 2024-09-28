import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { getDashboardMetrics } from '../controllers/dashboardController';

const router = express.Router();
const prisma = new PrismaClient();

router.use(express.json()); // Middleware to parse JSON bodies

// Create a new topic
router.post('/topics', async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    const newTopic = await prisma.topic.create({
      data: { name, description },
    });
    res.status(201).json({
      message: 'Topic created successfully',
      topic: newTopic,
    });
  } catch (error) {
    console.error('Error in creating the topic:', error);
    res.status(500).json({ error: 'An error occurred while creating the topic' });
  }
});

// Fetch questions for a specific topic
router.get('/topics/:topicId/questions', async (req: Request, res: Response) => {
  try {
    const topicId = parseInt(req.params.topicId);
    const questions = await prisma.question.findMany({
      where: { topicId },
    });
    res.json(questions);
  } catch (error) {
    console.error('Error fetching questions for topic:', error);
    res.status(500).json({ error: 'An error occurred while fetching questions' });
  }
});

// Fetch all topics
router.get('/topics', async (req: Request, res: Response) => {
  try {
    const topics = await prisma.topic.findMany();
    res.json(topics);
  } catch (error) {
    console.error('Error fetching topics:', error);
    res.status(500).json({ error: 'An error occurred while fetching topics' });
  }
});

// Fetch a specific topic and its questions
router.get('/topics/:topicId', async (req: Request, res: Response) => {
  try {
    const topic = await prisma.topic.findUnique({
      where: { id: parseInt(req.params.topicId) },
      include: { questions: true },
    });
    if (!topic) {
      return res.status(404).json({ error: 'Topic not found' });
    }
    res.json(topic);
  } catch (error) {
    console.error('Error fetching the topic:', error);
    res.status(500).json({ error: 'An error occurred while fetching the topic' });
  }
});

// Update a question within a topic
router.put('/topics/:topicId/questions/:questionId', async (req: Request, res: Response) => {
  try {
    const { title, isSolved, link, youtube } = req.body;
    const questionId = parseInt(req.params.questionId);

    const updatedQuestion = await prisma.question.update({
      where: { id: questionId },
      data: { title, isSolved, link, youtube },
    });

    res.json({
      message: 'Question updated successfully',
      question: updatedQuestion,
    });
  } catch (error) {
    console.error('Error updating the question:', error);
    res.status(500).json({ error: 'An error occurred while updating the question' });
  }
});

// Create a new question for a specific topic
router.post('/topics/:topicId/questions', async (req: Request, res: Response) => {
  try {
    const { title, isSolved, link, youtube } = req.body;
    const topicId = parseInt(req.params.topicId);

    const newQuestion = await prisma.question.create({
      data: { title, isSolved, link, youtube, topicId },
    });

    res.status(201).json({
      message: 'Question created successfully',
      question: newQuestion,
    });
  } catch (error) {
    console.error('Error in creating the question:', error);
    res.status(500).json({ error: 'An error occurred while creating the question' });
  }
});

// Delete a question
router.delete('/topics/:topicId/questions/:questionId', async (req: Request, res: Response) => {
  try {
    const questionId = parseInt(req.params.questionId);

    await prisma.question.delete({
      where: { id: questionId },
    });

    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    console.error('Error deleting the question:', error);
    res.status(500).json({ error: 'An error occurred while deleting the question' });
  }
});
router.get('/metrics', getDashboardMetrics);
export default router;
