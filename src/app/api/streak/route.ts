import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";
import Topic from "@/lib/models/Topic";
import { checkStreakReset } from "@/lib/streak";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  await dbConnect();
  await checkStreakReset(userId);

  const user = await User.findOne({ clerkId: userId });
  const topicsCompleted = await Topic.find({
    clerkId: userId,
    completed: true,
    completedAt: { $exists: true },
  }).select("completedAt");

  return NextResponse.json({
    currentStreak: user?.currentStreak || 0,
    longestStreak: user?.longestStreak || 0,
    activeDates: topicsCompleted.map((t) => t.completedAt),
  });
}
