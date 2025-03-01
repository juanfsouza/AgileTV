"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/buttonWhite";
import { Card, CardContent, CardDescription, CardFooter, CardFooterCenter, CardHeader, CardTitle } from "../../components/ui/card";
import { BorderBeam } from "../../components/ui/border-beam";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<any>({});
  const [touched, setTouched] = useState({ name: false, email: false, password: false });
  const router = useRouter();

  const handleFocus = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleRegister = async () => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        router.push("/auth/login");
      } else {
        setErrors(data.message);
      }
    } catch (error) {
      console.error("Erro ao registrar", error);
    }
  };

  const handleLoginRedirect = () => {
    router.push("/auth/login");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-black">
      <Card className="relative w-[350px] overflow-hidden">
        <CardHeader>
          <CardTitle>Registro</CardTitle>
          <CardDescription>
            Preencha seus dados para criar uma conta.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              {/* Campo de Nome */}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Digite seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={() => handleFocus("name")}
                />
                {touched.name && (
                  <p className="text-gray-500 text-sm">
                    ℹ️ O nome deve ter entre 3 e 50 caracteres e conter apenas letras e espaços.
                  </p>
                )}
                {touched.name && errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
              </div>

              {/* Campo de Email */}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Digite seu email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => handleFocus("email")}
                />
                {touched.email && errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
              </div>

              {/* Campo de Senha */}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => handleFocus("password")}
                />
                {touched.password && (
                  <p className="text-gray-500 text-sm">
                    ℹ️ A senha deve ter pelo menos 8 caracteres, incluindo:
                    <ul className="list-disc list-inside">
                      <li>1 letra maiúscula</li>
                      <li>1 letra minúscula</li>
                      <li>1 número</li>
                      <li>1 caractere especial</li>
                    </ul>
                  </p>
                )}
                {touched.password && errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
              </div>
            </div>
          </form>
        </CardContent>
        {/* Botão de Registro */}
        <CardFooterCenter>
          <Button onClick={handleRegister}>
            Registrar
          </Button>
        </CardFooterCenter>
        <CardFooter>
          {/* Link para login */}
          <div className="text-center text-sm text-gray-500 mt-4">
            Já tem uma conta?{" "}
            <button
              onClick={handleLoginRedirect}
              className="text-blue-500"
            >
              Faça login aqui
            </button>
          </div>
        </CardFooter>
        <BorderBeam duration={8} size={100} />
      </Card>
    </div>
  );
}