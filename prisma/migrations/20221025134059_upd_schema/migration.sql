/*
  Warnings:

  - You are about to drop the column `eventId` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the `Schedule` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Employee" DROP CONSTRAINT "Employee_eventId_fkey";

-- DropForeignKey
ALTER TABLE "Schedule" DROP CONSTRAINT "Schedule_eventId_fkey";

-- DropForeignKey
ALTER TABLE "Schedule" DROP CONSTRAINT "Schedule_locationId_fkey";

-- AlterTable
ALTER TABLE "Employee" DROP COLUMN "eventId";

-- DropTable
DROP TABLE "Schedule";

-- CreateTable
CREATE TABLE "EventVisitor" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "scheduleId" TEXT NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "EventVisitor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventSchedule" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "dateTimeFrom" TIMESTAMP(3) NOT NULL,
    "dateTimeTo" TIMESTAMP(3) NOT NULL,
    "locationId" TEXT,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "EventSchedule_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "EventVisitor" ADD CONSTRAINT "EventVisitor_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "EventSchedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventVisitor" ADD CONSTRAINT "EventVisitor_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventVisitor" ADD CONSTRAINT "EventVisitor_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventSchedule" ADD CONSTRAINT "EventSchedule_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventSchedule" ADD CONSTRAINT "EventSchedule_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;
