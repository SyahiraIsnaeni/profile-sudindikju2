-- CreateTable
CREATE TABLE "artikels" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "judul" VARCHAR(255) NOT NULL,
    "deskripsi" TEXT,
    "kategori" VARCHAR(100),
    "gambar" TEXT,
    "file" TEXT,
    "penulis" VARCHAR(255),
    "tanggal" TIMESTAMP(3) NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3)
);

-- CreateIndex
CREATE INDEX "artikels_kategori_idx" ON "artikels"("kategori");
CREATE INDEX "artikels_status_idx" ON "artikels"("status");
CREATE INDEX "artikels_tanggal_idx" ON "artikels"("tanggal");
