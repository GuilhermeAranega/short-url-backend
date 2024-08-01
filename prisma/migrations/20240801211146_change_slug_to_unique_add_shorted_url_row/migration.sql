/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `links` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[shorted_url]` on the table `links` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `shorted_url` to the `links` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "links" ADD COLUMN     "shorted_url" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "links_slug_key" ON "links"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "links_shorted_url_key" ON "links"("shorted_url");
