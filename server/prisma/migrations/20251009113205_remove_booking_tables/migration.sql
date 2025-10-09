-- RemoveBookingTables
-- Drop tables that are no longer needed after simplifying to treatment management only

-- Drop dependent tables first (tables with foreign keys)
DROP TABLE IF EXISTS "Booking" CASCADE;

-- Drop independent tables
DROP TABLE IF EXISTS "BlackoutSlot" CASCADE;
DROP TABLE IF EXISTS "BusinessHour" CASCADE;

-- Remove the Booking relation from Service table (already done in schema.prisma)
-- No SQL needed since we removed the relation before dropping the table
