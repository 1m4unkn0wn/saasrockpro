-- DropForeignKey
ALTER TABLE "ApiKeyLog" DROP CONSTRAINT "ApiKeyLog_apiKeyId_fkey";

-- AddForeignKey
ALTER TABLE "ApiKeyLog" ADD CONSTRAINT "ApiKeyLog_apiKeyId_fkey" FOREIGN KEY ("apiKeyId") REFERENCES "ApiKey"("id") ON DELETE SET NULL ON UPDATE CASCADE;
