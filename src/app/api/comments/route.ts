import { NextResponse } from "next/server";
import prisma from "../../prisma/prisma";

export async function POST(request: Request) {
  const { showId, content } = await request.json();

  if (!content || content.trim().length === 0) {
    return NextResponse.json({ error: "Content cannot be empty" }, { status: 400 });
  }

  try {
    const comment = await prisma.comment.create({
      data: {
        content,
        userId: "userId",
        showId,
      },
    });

    return NextResponse.json(comment);
  } catch (error) {
    return NextResponse.json({ error: "Error while submitting comment" }, { status: 500 });
  }
}
