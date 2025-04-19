import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const { title, content, imageUrl, type } = req.body;
      
      const post = await prisma.post.create({
        data: {
          title,
          content,
          imageUrl,
          type: type as 'COMPLAINT' | 'DISCUSSION' | 'QUESTION' | 'ANNOUNCEMENT',
        },
      });

      return res.status(201).json(post);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to create post' });
    }
  } else if (req.method === 'GET') {
    try {
      const posts = await prisma.post.findMany({
        orderBy: { createdAt: 'desc' },
      });
      return res.status(200).json(posts);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch posts' });
    }
  }

  return res.status(405).end();
}