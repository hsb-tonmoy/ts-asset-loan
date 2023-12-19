-- DropForeignKey
ALTER TABLE "AssetCheckout" DROP CONSTRAINT "AssetCheckout_request_id_fkey";

-- AlterTable
ALTER TABLE "AssetCheckout" ALTER COLUMN "request_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "AssetCheckout" ADD CONSTRAINT "AssetCheckout_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "Request"("id") ON DELETE SET NULL ON UPDATE CASCADE;
