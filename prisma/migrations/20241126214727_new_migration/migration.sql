/*
  Warnings:

  - You are about to drop the column `fullname` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "fullname",
ADD COLUMN     "dob" TIMESTAMP(3),
ADD COLUMN     "facebookLink" TEXT,
ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "gender" "Gender",
ADD COLUMN     "instagramLink" TEXT,
ADD COLUMN     "lastName" TEXT,
ADD COLUMN     "nationality" TEXT,
ADD COLUMN     "otherName" TEXT,
ADD COLUMN     "phoneNumber" TEXT,
ADD COLUMN     "snapChatLink" TEXT,
ADD COLUMN     "websiteLink" TEXT,
ADD COLUMN     "whatsAppLink" TEXT,
ALTER COLUMN "username" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Otp" (
    "id" TEXT NOT NULL,
    "otp" TEXT NOT NULL,
    "expiresIn" TIMESTAMP(3) NOT NULL,
    "valid" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Otp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResetToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "valid" BOOLEAN NOT NULL DEFAULT true,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ResetToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_RegisteredUsers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ResetToken_id_key" ON "ResetToken"("id");

-- CreateIndex
CREATE UNIQUE INDEX "_RegisteredUsers_AB_unique" ON "_RegisteredUsers"("A", "B");

-- CreateIndex
CREATE INDEX "_RegisteredUsers_B_index" ON "_RegisteredUsers"("B");

-- AddForeignKey
ALTER TABLE "_RegisteredUsers" ADD CONSTRAINT "_RegisteredUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RegisteredUsers" ADD CONSTRAINT "_RegisteredUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
