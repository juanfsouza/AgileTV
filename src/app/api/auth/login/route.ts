import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { LoginDto } from "./dtos/login.dto";
import prisma from "@/src/app/prisma/prisma";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    LoginDto.parse({ email, password });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ message: "Usuário não encontrado" }, { status: 404 });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json({ message: "Senha incorreta" }, { status: 401 });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    return NextResponse.json({ message: "Login bem-sucedido", token });

  } catch (error) {
    return NextResponse.json({ message: "Erro ao realizar login", error }, { status: 400 });
  }
}
