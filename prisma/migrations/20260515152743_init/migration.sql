-- CreateEnum
CREATE TYPE "RoomType" AS ENUM ('SINGLE', 'DOUBLE', 'NO_PREFERENCE');

-- CreateEnum
CREATE TYPE "ParticipantStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED');

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "raceDate" TIMESTAMP(3) NOT NULL,
    "registrationDeadline" TIMESTAMP(3),
    "description" TEXT,
    "privateToken" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Participant" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "departureCity" TEXT,
    "preferredOutboundDate" TIMESTAMP(3),
    "preferredReturnDate" TIMESTAMP(3),
    "roomType" "RoomType" NOT NULL DEFAULT 'NO_PREFERENCE',
    "roommatePreference" TEXT,
    "notes" TEXT,
    "status" "ParticipantStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Participant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FlightOption" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "airline" TEXT NOT NULL,
    "route" TEXT NOT NULL,
    "departureDatetime" TIMESTAMP(3) NOT NULL,
    "returnDatetime" TIMESTAMP(3) NOT NULL,
    "price" DOUBLE PRECISION,
    "notes" TEXT,

    CONSTRAINT "FlightOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HotelOption" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "stars" INTEGER,
    "pricePerNight" DOUBLE PRECISION,
    "roomTypesAvailable" TEXT,
    "notes" TEXT,

    CONSTRAINT "HotelOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParticipantFlight" (
    "participantId" TEXT NOT NULL,
    "flightOptionId" TEXT NOT NULL,

    CONSTRAINT "ParticipantFlight_pkey" PRIMARY KEY ("participantId")
);

-- CreateTable
CREATE TABLE "ParticipantHotel" (
    "participantId" TEXT NOT NULL,
    "hotelOptionId" TEXT NOT NULL,
    "roomType" "RoomType" NOT NULL DEFAULT 'NO_PREFERENCE',
    "checkIn" TIMESTAMP(3),
    "checkOut" TIMESTAMP(3),

    CONSTRAINT "ParticipantHotel_pkey" PRIMARY KEY ("participantId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Event_privateToken_key" ON "Event"("privateToken");

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlightOption" ADD CONSTRAINT "FlightOption_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HotelOption" ADD CONSTRAINT "HotelOption_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParticipantFlight" ADD CONSTRAINT "ParticipantFlight_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParticipantFlight" ADD CONSTRAINT "ParticipantFlight_flightOptionId_fkey" FOREIGN KEY ("flightOptionId") REFERENCES "FlightOption"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParticipantHotel" ADD CONSTRAINT "ParticipantHotel_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParticipantHotel" ADD CONSTRAINT "ParticipantHotel_hotelOptionId_fkey" FOREIGN KEY ("hotelOptionId") REFERENCES "HotelOption"("id") ON DELETE CASCADE ON UPDATE CASCADE;
