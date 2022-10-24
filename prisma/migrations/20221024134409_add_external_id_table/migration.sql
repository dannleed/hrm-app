/*
  Warnings:

  - You are about to drop the column `internalId` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `flat` on the `EmployeeAddress` table. All the data in the column will be lost.
  - You are about to drop the column `house` on the `EmployeeAddress` table. All the data in the column will be lost.
  - You are about to drop the column `street` on the `EmployeeAddress` table. All the data in the column will be lost.
  - Added the required column `address` to the `EmployeeAddress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zipCode` to the `EmployeeAddress` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ExternalIdType" AS ENUM ('PREVIOUS_DB_ID', 'RKEEPER_ID', 'OTHER');

-- AlterEnum
ALTER TYPE "Sex" ADD VALUE 'NOT_SPECIFIED';

-- DropIndex
DROP INDEX "Employee_internalId_key";

-- AlterTable
ALTER TABLE "Employee" DROP COLUMN "internalId";

-- AlterTable
ALTER TABLE "EmployeeAddress" DROP COLUMN "flat",
DROP COLUMN "house",
DROP COLUMN "street",
ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "zipCode" TEXT NOT NULL,
ALTER COLUMN "isMain" SET DEFAULT false;

-- CreateTable
CREATE TABLE "EmployeeExternalId" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "type" "ExternalIdType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "EmployeeExternalId_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "EmployeeExternalId" ADD CONSTRAINT "EmployeeExternalId_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;
