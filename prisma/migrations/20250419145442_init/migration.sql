-- CreateEnum
CREATE TYPE "PostType" AS ENUM ('COMPLAINT', 'DISCUSSION', 'QUESTION', 'ANNOUNCEMENT');

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "imageUrl" TEXT,
    "upvotes" INTEGER NOT NULL DEFAULT 0,
    "type" "PostType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);
