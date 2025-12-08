CREATE TABLE "profiles" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "description" TEXT,
    "vision" TEXT,
    "mission" TEXT,
    "motto" TEXT,
    "structure_org" VARCHAR(255),
    "maklumat" VARCHAR(255),
    "task_org" TEXT,
    "function_org" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3)
);
