import { NextRequest, NextResponse } from "next/server";
import prisma from "@/src/app/prisma/prisma";
import { verifyToken } from "../../utils/auth";

export async function GET(req: NextRequest) {
  try {
    const showId = req.nextUrl.searchParams.get("showId");

    if (!showId) {
      return NextResponse.json({ message: "showId não fornecido" }, { status: 400 });
    }

    // Busca todas as avaliações do show
    const ratings = await prisma.rating.findMany({
      where: { showId: showId },
    });

    const totalRatings = ratings.length;
    const average =
      totalRatings > 0
        ? ratings.reduce((acc, rating) => acc + rating.value, 0) / totalRatings
        : 0;

    return NextResponse.json({ average, count: totalRatings }, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar avaliações:", error);
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

    const { showId, value } = await req.json();

    if (!showId || !value) {
      return NextResponse.json(
        { message: "Parâmetros 'showId' e 'value' são obrigatórios" },
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

    // Verifica se o usuário já avaliou o show
    const existingRating = await prisma.rating.findFirst({
      where: {
        userId: decoded.userId,
        showId: showIdStr,
      },
    });

    if (existingRating) {
      return NextResponse.json(
        { message: "Você já avaliou este show" },
        { status: 400 }
      );
    }

    // Cria a avaliação
    const rating = await prisma.rating.create({
      data: {
        userId: decoded.userId,
        showId: showIdStr,
        value: value,
      },
    });

    return NextResponse.json(rating, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar avaliação:", error);
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}