CREATE TABLE "layanans" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "nama" VARCHAR(255) NOT NULL,
    "deskripsi" TEXT,
    "file" TEXT,
    "icon" VARCHAR(255),
    "urutan" INTEGER,
    "status" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3)
);
