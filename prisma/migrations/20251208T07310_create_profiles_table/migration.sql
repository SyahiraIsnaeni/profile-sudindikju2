CREATE TABLE "profiles" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "deskripsi" TEXT,
    "visi" TEXT,
    "misi" TEXT,
    "motto" TEXT,
    "struktur_organisasi" TEXT,
    "maklumat" TEXT,
    "tugas" TEXT,
    "fungsi" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL
);