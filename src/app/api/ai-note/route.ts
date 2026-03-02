import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dbConnect from "@/lib/db";
import Topic from "@/lib/models/Topic";
import Note from "@/lib/models/Note";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  const { topicId } = await req.json();
  await dbConnect();

  const topic = await Topic.findOne({ _id: topicId, clerkId: userId });
  if (!topic) return new NextResponse("Topic not found", { status: 404 });

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = `
      Create a very short, effective study note (max 280 characters) for the topic: "${topic.title}".
      The note should be concise, technical, and ready to be stored in a progress tracker.
      No markdown, just plain text.
    `;

    const result = await model.generateContent(prompt);
    const content = result.response.text().trim();

    const note = await Note.create({
      clerkId: userId,
      topicId: topic._id,
      content: content.slice(0, 300),
    });

    return NextResponse.json(note);
  } catch (error) {
    console.error("AI Note Error:", error);
    return new NextResponse("AI error", { status: 500 });
  }
}
