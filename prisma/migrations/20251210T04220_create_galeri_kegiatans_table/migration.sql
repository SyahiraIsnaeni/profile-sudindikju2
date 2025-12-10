CREATE TABLE "galeri_kegiatans" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "judul" VARCHAR(255) NOT NULL,
    "foto" TEXT,
    "status" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3)
);