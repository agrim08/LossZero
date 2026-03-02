import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/db";
import Topic from "@/lib/models/Topic";
import { updateStreak } from "@/lib/streak";
import User from "@/lib/models/User";
import Note from "@/lib/models/Note";
import { generateTopicNote } from "@/lib/gemini";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  await dbConnect();

  // Seed topics if none exist
  const { seedTopics } = await import("@/lib/seed");
  await seedTopics(userId);

  // Ensure user exists in our DB
  let user = await User.findOne({ clerkId: userId });
  if (!user) {
    user = await User.create({ clerkId: userId });
  }

  const topics = await Topic.find({ clerkId: userId }).sort({
    week: 1,
    _id: 1,
  });
  return NextResponse.json(topics);
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  const { topicId, completed } = await req.json();
  await dbConnect();

  const topic = await Topic.findOneAndUpdate(
    { _id: topicId, clerkId: userId },
    { completed, completedAt: completed ? new Date() : null },
    { new: true },
  );

  if (completed) {
    await updateStreak(userId);
    // Auto-generate AI note
    try {
      const content = await generateTopicNote(topic.title);
      await Note.create({
        clerkId: userId,
        topicId: topic._id,
        content,
      });
    } catch (err) {
      console.error("Auto-note error:", err);
    }
  }

  return NextResponse.json(topic);
}

export async function PUT(req: Request) {
  const { userId } = await auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  const { title, tag, week } = await req.json();
  await dbConnect();

  const topic = await Topic.create({
    clerkId: userId,
    title,
    tag: tag || "Custom",
    week: week || 1,
    completed: false,
  });

  return NextResponse.json(topic);
}

export async function DELETE(req: Request) {
  const { userId } = await auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  const { searchParams } = new URL(req.url);
  const topicId = searchParams.get("topicId");

  if (!topicId) return new NextResponse("Missing topicId", { status: 400 });

  await dbConnect();
  await Topic.findOneAndDelete({ _id: topicId, clerkId: userId });

  return new NextResponse("Deleted", { status: 200 });
}
