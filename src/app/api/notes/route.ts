import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/db";
import Note from "@/lib/models/Note";
import { subDays } from "date-fns";
import { updateStreak } from "@/lib/streak";

export async function GET(req: Request) {
  const { userId } = await auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  await dbConnect();
  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get("limit") || "50");
  const fiveDaysAgo = subDays(new Date(), 5);

  const notes = await Note.find({
    clerkId: userId,
    createdAt: { $gte: fiveDaysAgo },
  })
    .populate("topicId", "title")
    .sort({ createdAt: -1 })
    .limit(limit);

  return NextResponse.json(notes);
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  const { topicId, content } = await req.json();
  if (content.length > 3000)
    return new NextResponse("Note too long", { status: 400 });

  await dbConnect();
  const note = await Note.create({
    clerkId: userId,
    topicId,
    content,
  });

  await updateStreak(userId);

  return NextResponse.json(note);
}

export async function DELETE(req: Request) {
  const { userId } = await auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  await dbConnect();
  await Note.deleteOne({ _id: id, clerkId: userId });

  return NextResponse.json({ success: true });
}
