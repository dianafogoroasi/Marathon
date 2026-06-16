import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();

  const participant = await prisma.participant.update({
    where: { id },
    data: {
      name: body.name,
      email: body.email ?? null,
      phone: body.phone ?? null,
      confirmed: body.confirmed,
      declined: body.declined,
      raceType: body.raceType ?? null,
      departureDate: body.departureDate ?? null,
      returnDate: body.returnDate ?? null,
      hasBib: body.hasBib,
      hasTransport: body.hasTransport,
      transportType: body.transportType ?? null,
      transportName: body.transportName ?? null,
      hasHotel: body.hasHotel,
      hotelName: body.hotelName ?? null,
      hotelAddress: body.hotelAddress ?? null,
      notes: body.notes ?? null,
    },
  });
  return NextResponse.json(participant);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.participant.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
