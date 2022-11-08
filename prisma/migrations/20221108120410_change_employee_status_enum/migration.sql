/*
  Warnings:

  - The values [HIRED] on the enum `EmployeeStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EmployeeStatus_new" AS ENUM ('CANDIDATE', 'FULLTIME', 'PARTTIME', 'FIRED', 'MATERNITY_LEAVE');
ALTER TABLE "Employee" ALTER COLUMN "status" TYPE "EmployeeStatus_new" USING ("status"::text::"EmployeeStatus_new");
ALTER TYPE "EmployeeStatus" RENAME TO "EmployeeStatus_old";
ALTER TYPE "EmployeeStatus_new" RENAME TO "EmployeeStatus";
DROP TYPE "EmployeeStatus_old";
COMMIT;
