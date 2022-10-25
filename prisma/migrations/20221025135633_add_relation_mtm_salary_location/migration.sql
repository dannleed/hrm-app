-- CreateTable
CREATE TABLE "_LocationToSalary" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_LocationToSalary_AB_unique" ON "_LocationToSalary"("A", "B");

-- CreateIndex
CREATE INDEX "_LocationToSalary_B_index" ON "_LocationToSalary"("B");

-- AddForeignKey
ALTER TABLE "_LocationToSalary" ADD CONSTRAINT "_LocationToSalary_A_fkey" FOREIGN KEY ("A") REFERENCES "Location"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LocationToSalary" ADD CONSTRAINT "_LocationToSalary_B_fkey" FOREIGN KEY ("B") REFERENCES "Salary"("id") ON DELETE CASCADE ON UPDATE CASCADE;
