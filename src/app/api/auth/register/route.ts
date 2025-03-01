import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/src/app/prisma/prisma";
import { RegisterDto } from "./dtos/register.dto";


export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    RegisterDto.parse({ name, email, password });

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ message: "Email já registrado" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json({ message: "Usuário registrado com sucesso!" }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ message: "Erro ao registrar o usuário", error }, { status: 400 });
  }
}
