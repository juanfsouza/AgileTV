import { useState } from "react";
import { useRouter } from "next/navigation";

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Armazenar o token no localStorage ou Cookie
        localStorage.setItem("token", data.token);

        // Redirecionar para a página inicial
        router.push("/");
      } else {
        // Se não for sucesso, lançar erro
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Login falhou:", error);
      throw new Error("Erro ao tentar fazer login");
    } finally {
      setLoading(false);
    }
  };

  return { login, loading };
}
