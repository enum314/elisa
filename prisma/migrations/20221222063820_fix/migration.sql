-- DropIndex
DROP INDEX "GlobalMessage_authorId_key";

-- AlterTable
ALTER TABLE "Profile" ALTER COLUMN "nickname" SET DEFAULT '';
