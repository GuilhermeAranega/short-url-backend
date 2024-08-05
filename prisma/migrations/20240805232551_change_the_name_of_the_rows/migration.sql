/*
  Warnings:

  - You are about to drop the column `usersId` on the `auth` table. All the data in the column will be lost.
  - You are about to drop the column `usersId` on the `links` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `auth` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `auth` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `links` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "auth" DROP CONSTRAINT "auth_usersId_fkey";

-- DropForeignKey
ALTER TABLE "links" DROP CONSTRAINT "links_usersId_fkey";

-- DropIndex
DROP INDEX "auth_usersId_key";

-- AlterTable
ALTER TABLE "auth" DROP COLUMN "usersId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "links" DROP COLUMN "usersId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "auth_userId_key" ON "auth"("userId");

-- AddForeignKey
ALTER TABLE "links" ADD CONSTRAINT "links_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth" ADD CONSTRAINT "auth_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
