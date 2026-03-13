-- CreateTable
CREATE TABLE "GateRecord" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "gateId" TEXT NOT NULL,
  "taskId" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "scopeJson" TEXT NOT NULL,
  "comment" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "resolvedAt" DATETIME
);

-- CreateIndex
CREATE UNIQUE INDEX "GateRecord_gateId_key" ON "GateRecord"("gateId");
