import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'PATCH') return res.status(405).end();

  const { id } = req.query;

  try {
    const post = await prisma.post.update({
      where: { id: id as string },
      data: { upvotes: { increment: 1 } },
    });

    return res.status(200).json(post);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to upvote post' });
  }
}