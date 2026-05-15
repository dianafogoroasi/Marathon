import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const event = await prisma.event.findUnique({
    where: { privateToken: token },
    include: { participants: { orderBy: { createdAt: "asc" } } },
  });
  if (!event) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(event);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const event = await prisma.event.findUnique({ where: { privateToken: token } });
  if (!event) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const participant = await prisma.participant.create({
    data: {
      eventId: event.id,
      name: body.name,
      email: body.email ?? null,
      phone: body.phone ?? null,
      notes: body.notes ?? null,
    },
  });
  return NextResponse.json(participant, { status: 201 });
}
