CREATE TABLE "users" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "role_id" INTEGER,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL UNIQUE,
    "password" VARCHAR(255) NOT NULL,
    "token_oauth" VARCHAR(500),
    "status" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "users_role_fk" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE SET NULL
);

-- Create indexes for better query performance
CREATE INDEX "users_email_idx" ON "users"("email");
CREATE INDEX "users_name_idx" ON "users"("name");