-- CreateTable
CREATE TABLE "User" (
    "sciper" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "givenName" TEXT NOT NULL,
    "familyName" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("sciper")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
