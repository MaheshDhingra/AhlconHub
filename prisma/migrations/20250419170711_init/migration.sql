/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `upvotes` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `clerkUserId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[clerkId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `authorId` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clerkId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_userId_fkey";

-- DropIndex
DROP INDEX "Post_userId_idx";

-- DropIndex
DROP INDEX "User_clerkUserId_key";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "imageUrl",
DROP COLUMN "upvotes",
DROP COLUMN "userId",
ADD COLUMN     "authorId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "clerkUserId",
DROP COLUMN "imageUrl",
ADD COLUMN     "clerkId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "_Upvotes" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_Upvotes_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_Upvotes_B_index" ON "_Upvotes"("B");

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkId_key" ON "User"("clerkId");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Upvotes" ADD CONSTRAINT "_Upvotes_A_fkey" FOREIGN KEY ("A") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Upvotes" ADD CONSTRAINT "_Upvotes_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
