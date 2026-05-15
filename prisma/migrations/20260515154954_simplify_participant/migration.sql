/*
  Warnings:

  - You are about to drop the column `departureCity` on the `Participant` table. All the data in the column will be lost.
  - You are about to drop the column `preferredOutboundDate` on the `Participant` table. All the data in the column will be lost.
  - You are about to drop the column `preferredReturnDate` on the `Participant` table. All the data in the column will be lost.
  - You are about to drop the column `roomType` on the `Participant` table. All the data in the column will be lost.
  - You are about to drop the column `roommatePreference` on the `Participant` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Participant` table. All the data in the column will be lost.
  - You are about to drop the `FlightOption` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `HotelOption` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ParticipantFlight` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ParticipantHotel` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `Participant` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "FlightOption" DROP CONSTRAINT "FlightOption_eventId_fkey";

-- DropForeignKey
ALTER TABLE "HotelOption" DROP CONSTRAINT "HotelOption_eventId_fkey";

-- DropForeignKey
ALTER TABLE "ParticipantFlight" DROP CONSTRAINT "ParticipantFlight_flightOptionId_fkey";

-- DropForeignKey
ALTER TABLE "ParticipantFlight" DROP CONSTRAINT "ParticipantFlight_participantId_fkey";

-- DropForeignKey
ALTER TABLE "ParticipantHotel" DROP CONSTRAINT "ParticipantHotel_hotelOptionId_fkey";

-- DropForeignKey
ALTER TABLE "ParticipantHotel" DROP CONSTRAINT "ParticipantHotel_participantId_fkey";

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "officialUrl" TEXT;

-- AlterTable
ALTER TABLE "Participant" DROP COLUMN "departureCity",
DROP COLUMN "preferredOutboundDate",
DROP COLUMN "preferredReturnDate",
DROP COLUMN "roomType",
DROP COLUMN "roommatePreference",
DROP COLUMN "status",
ADD COLUMN     "hasBib" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasHotel" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasTransport" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "transportType" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "email" DROP NOT NULL;

-- DropTable
DROP TABLE "FlightOption";

-- DropTable
DROP TABLE "HotelOption";

-- DropTable
DROP TABLE "ParticipantFlight";

-- DropTable
DROP TABLE "ParticipantHotel";

-- DropEnum
DROP TYPE "ParticipantStatus";

-- DropEnum
DROP TYPE "RoomType";
