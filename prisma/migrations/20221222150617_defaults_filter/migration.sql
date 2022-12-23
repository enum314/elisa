-- AlterTable
ALTER TABLE "SiteSettings" ALTER COLUMN "filteredWords" SET DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "whitelistedWords" SET DEFAULT ARRAY[]::TEXT[];
