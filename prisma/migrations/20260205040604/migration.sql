/*
  Warnings:

  - You are about to drop the column `deleted_at` on the `permissions` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `roles` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "role_permissions" DROP CONSTRAINT "role_permissions_permission_fk";

-- DropForeignKey
ALTER TABLE "role_permissions" DROP CONSTRAINT "role_permissions_role_fk";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_role_fk";

-- DropIndex
DROP INDEX "artikels_kategori_idx";

-- DropIndex
DROP INDEX "artikels_status_idx";

-- DropIndex
DROP INDEX "artikels_tanggal_idx";

-- DropIndex
DROP INDEX "permissions_name_idx";

-- DropIndex
DROP INDEX "role_permissions_permission_id_idx";

-- DropIndex
DROP INDEX "roles_name_idx";

-- DropIndex
DROP INDEX "users_email_idx";

-- DropIndex
DROP INDEX "users_name_idx";

-- AlterTable
ALTER TABLE "permissions" DROP COLUMN "deleted_at",
ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "role_permissions" RENAME CONSTRAINT "role_permissions_pk" TO "role_permissions_pkey";

-- AlterTable
ALTER TABLE "roles" DROP COLUMN "deleted_at",
ALTER COLUMN "name" SET DATA TYPE TEXT,
ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "name" SET DATA TYPE TEXT,
ALTER COLUMN "email" SET DATA TYPE TEXT,
ALTER COLUMN "password" SET DATA TYPE TEXT,
ALTER COLUMN "token_oauth" SET DATA TYPE TEXT,
ALTER COLUMN "updated_at" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
