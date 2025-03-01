import { NextResponse } from "next/server";
import prisma from "@/src/app/prisma/prisma";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
  try {
    // Extrair o token do cabeçalho de autorização
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = decoded.userId;

    // Extrair o showId, title e imageUrl do corpo da requisição
    const { showId, title, imageUrl } = await request.json();

    // Verificar se o TVShow existe
    let tvShowExists = await prisma.tVShow.findUnique({
      where: { id: showId },
    });

    // Se o filme/série não existir, cadastre-o
    if (!tvShowExists) {
      tvShowExists = await prisma.tVShow.create({
        data: {
          id: showId,
          title,
          description: "Descrição padrão", // Adicione uma descrição padrão ou peça ao frontend para enviar
          imageUrl,
        },
      });
    }

    // Verificar se o filme já está na lista do usuário
    const existingEntry = await prisma.myList.findFirst({
      where: {
        userId,
        showId,
      },
    });

    if (existingEntry) {
      return NextResponse.json({ message: "Filme já está na sua lista" }, { status: 400 });
    }

    // Adicionar o filme à lista do usuário
    const myListEntry = await prisma.myList.create({
      data: {
        userId,
        showId,
        title,       // Campo obrigatório
        imageUrl,    // Campo obrigatório
      },
      include: {
        tvShow: true, // Incluir os dados do TVShow
      },
    });

    return NextResponse.json(myListEntry, { status: 201 });
  } catch (error) {
    console.error("Erro ao adicionar à lista:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}