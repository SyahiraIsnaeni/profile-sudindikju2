CREATE TABLE "permissions" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "detail" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3)
);

CREATE UNIQUE INDEX "permissions_name_detail_key" ON "permissions"("name", "detail");
CREATE INDEX "permissions_name_idx" ON "permissions"("name");