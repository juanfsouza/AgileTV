import { NextResponse } from "next/server";
import prisma from "@/src/app/prisma/prisma";

export async function POST(request: Request) {
  try {
    const { id, title, description, imageUrl } = await request.json();

    const existingTVShow = await prisma.tVShow.findUnique({
      where: { id },
    });

    if (existingTVShow) {
      return NextResponse.json({ message: "Filme/série já cadastrado" }, { status: 400 });
    }

    // Cadastrar o filme/série
    const tvShow = await prisma.tVShow.create({
      data: {
        id,
        title,
        description,
        imageUrl,
      },
    });

    return NextResponse.json(tvShow, { status: 201 });
  } catch (error) {
    console.error("Erro ao cadastrar filme/série:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}