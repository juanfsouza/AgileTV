/*
  Warnings:

  - A unique constraint covering the columns `[userId,showId]` on the table `Rating` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Rating_userId_showId_key" ON "Rating"("userId", "showId");
