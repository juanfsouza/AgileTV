/*
  Warnings:

  - A unique constraint covering the columns `[userId,showId]` on the table `MyList` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "MyList_userId_showId_key" ON "MyList"("userId", "showId");
