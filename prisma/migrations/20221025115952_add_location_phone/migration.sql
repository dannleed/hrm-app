/*
  Warnings:

  - You are about to drop the column `internalId` on the `Location` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[externalId]` on the table `Location` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `address` to the `Location` table without a default value. This is not possible if the table is not empty.
  - Added the required column `externalId` to the `Location` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "EmployeeLocationHistory" DROP CONSTRAINT "EmployeeLocationHistory_employeeId_fkey";

-- DropForeignKey
ALTER TABLE "EmployeeLocationHistory" DROP CONSTRAINT "EmployeeLocationHistory_locationId_fkey";

-- DropForeignKey
ALTER TABLE "EmployeePositionHistory" DROP CONSTRAINT "EmployeePositionHistory_employeeId_fkey";

-- DropForeignKey
ALTER TABLE "EmployeePositionHistory" DROP CONSTRAINT "EmployeePositionHistory_positionId_fkey";

-- DropIndex
DROP INDEX "Location_internalId_key";

-- AlterTable
ALTER TABLE "Location" DROP COLUMN "internalId",
ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "externalId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "LocationPhone" (
    "id" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "LocationPhone_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Location_externalId_key" ON "Location"("externalId");

-- AddForeignKey
ALTER TABLE "EmployeePositionHistory" ADD CONSTRAINT "EmployeePositionHistory_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeePositionHistory" ADD CONSTRAINT "EmployeePositionHistory_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "Position"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocationPhone" ADD CONSTRAINT "LocationPhone_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeLocationHistory" ADD CONSTRAINT "EmployeeLocationHistory_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeLocationHistory" ADD CONSTRAINT "EmployeeLocationHistory_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE CASCADE ON UPDATE CASCADE;
