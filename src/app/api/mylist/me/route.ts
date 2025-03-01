import { NextResponse } from "next/server";
import prisma from "@/src/app/prisma/prisma";
import jwt from "jsonwebtoken";

export async function GET(request: Request) {
  try {
    // Extrair o token do cabeçalho de autorização
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = decoded.userId;

    // Buscar a lista do usuário
    const myList = await prisma.myList.findMany({
      where: { userId },
      include: { tvShow: true },
    });

    return NextResponse.json(myList, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar lista:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}