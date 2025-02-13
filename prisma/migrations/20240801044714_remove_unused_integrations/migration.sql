/*
  Warnings:

  - You are about to drop the `Integration` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `IntegrationObjectMap` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `IntegrationPropertyMap` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `IntegrationRow` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `IntegrationSync` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `IntegrationSyncLog` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Integration" DROP CONSTRAINT "Integration_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "IntegrationObjectMap" DROP CONSTRAINT "IntegrationObjectMap_integrationId_fkey";

-- DropForeignKey
ALTER TABLE "IntegrationObjectMap" DROP CONSTRAINT "IntegrationObjectMap_toEntityId_fkey";

-- DropForeignKey
ALTER TABLE "IntegrationPropertyMap" DROP CONSTRAINT "IntegrationPropertyMap_objectMapId_fkey";

-- DropForeignKey
ALTER TABLE "IntegrationPropertyMap" DROP CONSTRAINT "IntegrationPropertyMap_toPropertyId_fkey";

-- DropForeignKey
ALTER TABLE "IntegrationRow" DROP CONSTRAINT "IntegrationRow_objectMapId_fkey";

-- DropForeignKey
ALTER TABLE "IntegrationRow" DROP CONSTRAINT "IntegrationRow_rowId_fkey";

-- DropForeignKey
ALTER TABLE "IntegrationSync" DROP CONSTRAINT "IntegrationSync_createdByApiKeyId_fkey";

-- DropForeignKey
ALTER TABLE "IntegrationSync" DROP CONSTRAINT "IntegrationSync_createdByUserId_fkey";

-- DropForeignKey
ALTER TABLE "IntegrationSync" DROP CONSTRAINT "IntegrationSync_integrationId_fkey";

-- DropForeignKey
ALTER TABLE "IntegrationSyncLog" DROP CONSTRAINT "IntegrationSyncLog_entityId_fkey";

-- DropForeignKey
ALTER TABLE "IntegrationSyncLog" DROP CONSTRAINT "IntegrationSyncLog_relationshipId_fkey";

-- DropForeignKey
ALTER TABLE "IntegrationSyncLog" DROP CONSTRAINT "IntegrationSyncLog_rowId_fkey";

-- DropForeignKey
ALTER TABLE "IntegrationSyncLog" DROP CONSTRAINT "IntegrationSyncLog_syncId_fkey";

-- DropTable
DROP TABLE "Integration";

-- DropTable
DROP TABLE "IntegrationObjectMap";

-- DropTable
DROP TABLE "IntegrationPropertyMap";

-- DropTable
DROP TABLE "IntegrationRow";

-- DropTable
DROP TABLE "IntegrationSync";

-- DropTable
DROP TABLE "IntegrationSyncLog";
