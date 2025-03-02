import { NextRequest, NextResponse } from "next/server";
import prisma from "@/src/app/prisma/prisma";
import { verifyToken } from "../../utils/auth";

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("Authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ message: "Token inválido" }, { status: 401 });
    }

    const { showId, content } = await req.json();

    if (!showId || !content) {
      return NextResponse.json(
        { message: "Parâmetros 'showId' e 'content' são obrigatórios" },
        { status: 400 }
      );
    }

    const showIdStr = String(showId);

    const comment = await prisma.comment.create({
      data: {
        userId: decoded.userId,
        showId: showIdStr,
        content: content,
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar comentário:", error);
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}