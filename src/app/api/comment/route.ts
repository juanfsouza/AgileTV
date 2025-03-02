import { NextRequest, NextResponse } from "next/server";
import prisma from "@/src/app/prisma/prisma";
import { verifyToken } from "../../utils/auth";

export async function GET(req: NextRequest) {
  try {
    const showId = req.nextUrl.searchParams.get("showId");

    if (!showId) {
      return NextResponse.json({ message: "showId não fornecido" }, { status: 400 });
    }

    // Busca todos os comentários do show
    const comments = await prisma.comment.findMany({
      where: { showId: showId },
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

    // Verifica se o TVShow existe
    let tvShow = await prisma.tVShow.findUnique({
      where: { id: showIdStr },
    });

    // Se não existir, cria um novo TVShow
    if (!tvShow) {
      tvShow = await prisma.tVShow.create({
        data: {
          id: showIdStr,
          title: "Título Padrão",
          description: "Descrição Padrão",
          imageUrl: "URL Padrão",
        },
      });
    }

    // Cria o comentário
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