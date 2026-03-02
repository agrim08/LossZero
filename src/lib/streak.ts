import User from "./models/User";
import Topic from "./models/Topic";
import Note from "./models/Note";
import { startOfDay, subDays, isSameDay } from "date-fns";

export async function updateStreak(clerkId: string) {
  const user = await User.findOne({ clerkId });
  if (!user) return null;

  const today = startOfDay(new Date());
  const lastActive = user.lastActiveDate
    ? startOfDay(user.lastActiveDate)
    : null;

  if (!lastActive) {
    // First activity
    user.currentStreak = 1;
    user.longestStreak = Math.max(user.longestStreak, 1);
    user.lastActiveDate = new Date();
  } else if (isSameDay(today, lastActive)) {
    // Already active today, no change to streak
  } else if (
    isSameDay(
      today,
      startOfDay(new Date(lastActive.getTime() + 24 * 60 * 60 * 1000)),
    )
  ) {
    // Continuous activity (yesterday was last active)
    user.currentStreak += 1;
    user.longestStreak = Math.max(user.longestStreak, user.currentStreak);
    user.lastActiveDate = new Date();
  } else {
    // Gap in activity, reset streak
    user.currentStreak = 1;
    user.lastActiveDate = new Date();
  }

  await user.save();
  return user;
}

export async function checkStreakReset(clerkId: string) {
  const user = await User.findOne({ clerkId });
  if (!user || !user.lastActiveDate) return null;

  const today = startOfDay(new Date());
  const lastActive = startOfDay(user.lastActiveDate);
  const yesterday = subDays(today, 1);

  if (lastActive < yesterday) {
    // More than a day gap, reset streak
    user.currentStreak = 0;
    await user.save();
  }
  return user;
}
