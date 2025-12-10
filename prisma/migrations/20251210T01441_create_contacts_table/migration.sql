CREATE TABLE "contacts" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "telephone" VARCHAR(20),
    "faximile" VARCHAR(20),
    "instagram" VARCHAR(255),
    "twitter" VARCHAR(255),
    "tiktok" VARCHAR(255),
    "youtube" VARCHAR(255),
    "url_maps" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL
);