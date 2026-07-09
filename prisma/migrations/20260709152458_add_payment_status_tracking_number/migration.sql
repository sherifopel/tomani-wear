-- AlterTable: add new columns safely for existing rows
ALTER TABLE "Order"
  ADD COLUMN "paymentStatus"  TEXT NOT NULL DEFAULT 'paid',
  ADD COLUMN "trackingNumber" TEXT,
  ADD COLUMN "updatedAt"      TIMESTAMP(3) NOT NULL DEFAULT NOW(),
  ALTER COLUMN "status"       SET DEFAULT 'processing';

-- Backfill existing orders: treat them as already paid and processing
UPDATE "Order" SET "paymentStatus" = 'paid' WHERE "paymentStatus" = 'pending';
