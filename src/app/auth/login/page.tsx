"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardFooterCenter, CardHeader, CardTitle } from "../../components/ui/card";
import { ShinyButton } from "../../components/ui/shiny-button";
import { BorderBeam } from "../../components/ui/border-beam";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading } = useAuth(); 
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    setError("");
    try {
      await login(email, password);
      router.push("/");
    } catch (error: any) {
      setError(error.message || "Credenciais inválidas. Tente novamente.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-black">
      <Card className="relative w-[350px] overflow-hidden">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Insira suas credenciais para acessar sua conta.</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              {/* Campo de Email */}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Digite seu email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => {}}
                />
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
                  onFocus={() => {}}
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}
              
            </div>
          </form>
        </CardContent>
        {/* Botão de Login */}
        <CardFooterCenter>
          <ShinyButton onClick={handleLogin} disabled={loading}>
            {loading ? "Carregando..." : "Login"}
          </ShinyButton>
        </CardFooterCenter>
        <CardFooter>
          <div className="text-center text-sm text-gray-500 mt-4">
            Não tem uma conta?{" "}
            <button
              onClick={() => router.push("/auth/register")}
              className="text-blue-500"
            >
              Registre-se aqui
            </button>
          </div>
        </CardFooter>
        <BorderBeam duration={8} size={100} />
      </Card>
    </div>
  );
}
