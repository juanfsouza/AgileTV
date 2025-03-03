<div align="center">
  
# 📺 Desafio AgileTv 📺 

![Screenshot_2](https://github.com/user-attachments/assets/6664e3a3-d545-476c-bdc0-3d87c9c54e19)

</div>

### Documentação do Projeto
Visão Geral
Este projeto é uma aplicação web desenvolvida com Next.js que permite gerenciar e exibir informações sobre séries de TV. Ele utiliza várias bibliotecas modernas para garantir uma experiência de usuário fluida e uma arquitetura robusta.

### Principais Funcionalidades
- Autenticação de usuários com NextAuth e JWT.
- Gerenciamento de estado global com Zustand.
- Integração com banco de dados PostgreSQL usando Prisma.
- Consumo de APIs externas com Axios e React Query.
- Interface moderna com componentes do Radix UI e ícones do Lucide React.
- Carrossel de imagens e conteúdo com Swiper.
- Validação de dados com Zod.

### Como Instalar e Rodar o Projeto
Pré-requisitos
Antes de começar, certifique-se de ter instalado:
- Node.js (versão 18 ou superior)
- Git
- PostgreSQL (ou outro banco de dados suportado pelo Prisma)

### Passos para Instalação
Clone o repositório:

```bash
git clone https://github.com/juanfsouza/AgileTV.git
cd AgileTV
```

Instale as dependências:
```bash
npm install
```

Configure o banco de dados:

Crie um banco de dados PostgreSQL.

Configure as variáveis de ambiente no arquivo .env:
```bash
DATABASE_URL="postgresql://USUARIO:SENHA@localhost:5432/NOME_DO_BANCO"
```

Execute as migrações do Prisma:

```bash
npx prisma migrate dev --name init
```
Popule o banco de dados (opcional):

Se necessário, execute scripts ou comandos para popular o banco de dados com dados iniciais.

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Abra o navegador e acesse:

```bash
http://localhost:3000
```

### Deploy: https://tv-show-app-omega.vercel.app/
