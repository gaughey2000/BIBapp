-- CreateEnum
CREATE TYPE "public"."TreatmentType" AS ENUM ('BOTULINUM_TOXIN', 'CHEMICAL_PEELS', 'DERMAL_FILLER', 'SKIN_CARE', 'OTHER_SERVICES');

-- AlterTable
ALTER TABLE "public"."Service" ADD COLUMN     "treatment_type" "public"."TreatmentType" NOT NULL DEFAULT 'OTHER_SERVICES';

-- CreateIndex
CREATE INDEX "Service_treatment_type_name_idx" ON "public"."Service"("treatment_type", "name");
