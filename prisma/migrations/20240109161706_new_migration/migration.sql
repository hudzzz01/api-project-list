/*
  Warnings:

  - You are about to drop the column `foto_kendaraan` on the `project` table. All the data in the column will be lost.
  - Added the required column `foto` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `project` DROP COLUMN `foto_kendaraan`,
    ADD COLUMN `foto` VARCHAR(191) NOT NULL;
