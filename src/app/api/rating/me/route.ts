import { NextResponse } from "next/server";
import prisma from "@/src/app/prisma/prisma";
import jwt from "jsonwebtoken";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = decoded.userId;

    const url = new URL(request.url);
    const showId = url.searchParams.get("showId");

    if (!showId) {
      return NextResponse.json(
        { message: "showId não fornecido" },
        { status: 400 }
      );
    }

    const rating = await prisma.rating.findFirst({
      where: {
        userId: userId,
        showId: showId,
      },
      select: {
        value: true,
      },
    });

    if (!rating) {
      return NextResponse.json({ rating: null }, { status: 200 });
    }

    return NextResponse.json({ rating: rating.value }, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar avaliação:", error);
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}