-- AddIndex: Address.userId
CREATE INDEX IF NOT EXISTS "Address_userId_idx" ON "Address" ("userId");

-- AddIndex: Order.userId
CREATE INDEX IF NOT EXISTS "Order_userId_idx" ON "Order" ("userId");

-- AddIndex: Order.paystackRef
CREATE INDEX IF NOT EXISTS "Order_paystackRef_idx" ON "Order" ("paystackRef");

-- AddIndex: Order.status
CREATE INDEX IF NOT EXISTS "Order_status_idx" ON "Order" ("status");

-- AddIndex: OrderItem.orderId
CREATE INDEX IF NOT EXISTS "OrderItem_orderId_idx" ON "OrderItem" ("orderId");
