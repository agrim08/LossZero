import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { generateStudyHint } from "@/lib/gemini";
import dbConnect from "@/lib/db";
import Topic from "@/lib/models/Topic";
import User from "@/lib/models/User";
import Note from "@/lib/models/Note";
import { startOfDay } from "date-fns";

export async function POST() {
  const { userId } = await auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  await dbConnect();

  const today = startOfDay(new Date());
  const user = await User.findOne({ clerkId: userId });

  // Check if hint already generated today
  if (
    user?.lastHintGeneratedAt &&
    startOfDay(user.lastHintGeneratedAt).getTime() === today.getTime()
  ) {
    return NextResponse.json({
      motivation: user.lastHintMotivation,
      summary: user.lastHintSummary,
      next_suggestion: user.lastHintNextSuggestion,
    });
  }

  const topicsToday = await Topic.find({
    clerkId: userId,
    completed: true,
    completedAt: { $gte: today },
  }).select("title");

  const lastNote = await Note.findOne({ clerkId: userId }).sort({
    createdAt: -1,
  });

  const hint = await generateStudyHint(
    topicsToday.map((t) => t.title),
    user?.currentStreak || 0,
    lastNote?.content || "No notes yet today.",
  );

  if (user) {
    user.lastHintGeneratedAt = new Date();
    user.lastHintMotivation = hint.motivation;
    user.lastHintSummary = hint.summary;
    user.lastHintNextSuggestion = hint.next_suggestion;
    await user.save();
  }

  return NextResponse.json(hint);
}
