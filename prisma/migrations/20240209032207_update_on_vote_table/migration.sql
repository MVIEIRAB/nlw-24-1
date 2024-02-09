/*
  Warnings:

  - You are about to drop the column `pollOption` on the `Vote` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[pollId,sessionId]` on the table `Vote` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `pollOptionId` to the `Vote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sessionId` to the `Vote` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Vote" DROP CONSTRAINT "Vote_pollOption_fkey";

-- AlterTable
ALTER TABLE "Vote" DROP COLUMN "pollOption",
ADD COLUMN     "pollOptionId" TEXT NOT NULL,
ADD COLUMN     "sessionId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Vote_pollId_sessionId_key" ON "Vote"("pollId", "sessionId");

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_pollOptionId_fkey" FOREIGN KEY ("pollOptionId") REFERENCES "PollOption"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
