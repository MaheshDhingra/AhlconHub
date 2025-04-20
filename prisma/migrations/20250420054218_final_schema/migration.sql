/*
  Warnings:

  - You are about to drop the column `upvotes` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the `_Upvotes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_Upvotes" DROP CONSTRAINT "_Upvotes_A_fkey";

-- DropForeignKey
ALTER TABLE "_Upvotes" DROP CONSTRAINT "_Upvotes_B_fkey";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "upvotes";

-- DropTable
DROP TABLE "_Upvotes";

-- CreateTable
CREATE TABLE "Upvote" (
    "clerkUserId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,

    CONSTRAINT "Upvote_pkey" PRIMARY KEY ("clerkUserId","postId")
);

-- AddForeignKey
ALTER TABLE "Upvote" ADD CONSTRAINT "Upvote_clerkUserId_fkey" FOREIGN KEY ("clerkUserId") REFERENCES "User"("clerkUserId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Upvote" ADD CONSTRAINT "Upvote_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
