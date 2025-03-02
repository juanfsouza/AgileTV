import { NextRequest, NextResponse } from "next/server";
import prisma from "@/src/app/prisma/prisma";

export async function GET(req: NextRequest) {
  try {
    const comments = await prisma.comment.findMany({
      select: {
        id: true,
        content: true,
        time: true,
        user: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        time: "desc",
      },
    });

    return NextResponse.json(comments, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar comentários:", error);
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}