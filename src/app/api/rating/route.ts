import { NextRequest, NextResponse } from "next/server";
import prisma from "@/src/app/prisma/prisma";

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