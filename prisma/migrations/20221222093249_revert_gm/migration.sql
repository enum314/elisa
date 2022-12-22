/*
  Warnings:

  - You are about to drop the `GlobalMessage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "GlobalMessage" DROP CONSTRAINT "GlobalMessage_authorId_fkey";

-- DropTable
DROP TABLE "GlobalMessage";
