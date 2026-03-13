-- CreateTable (PostgreSQL compatible - replaces SQLite migration)
CREATE TABLE "GateRecord" (
    "id" TEXT NOT NULL,
    "gateId" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "scopeJson" TEXT NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMPTZ,

    CONSTRAINT "GateRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GateRecord_gateId_key" ON "GateRecord"("gateId");
