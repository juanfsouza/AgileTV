const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export const api = {
  async registerUser(data: { name: string; email: string; password: string }) {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Erro ao registrar usuário");
    return res.json();
  },

  async loginUser(data: { email: string; password: string }) {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Credenciais inválidas");
    return res.json();
  },

  async getUserData(userId: string, token: string) {
    const res = await fetch(`${API_URL}/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error("Erro ao buscar perfil");
    return res.json();
  },
};

