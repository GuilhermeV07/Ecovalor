# 🚀 Guia de Setup - EcoValor Local

Bem-vindo! Este guia vai ajudá-lo a rodar a plataforma **EcoValor** no seu computador.

## 📋 Pré-requisitos

- ✅ Node.js 18+ instalado
- ✅ MySQL instalado e rodando
- ✅ Git (opcional, mas recomendado)

## 🔧 Passo 1: Extrair o ZIP

1. Extraia o arquivo `ecovalor-complete.zip` em uma pasta de sua escolha
2. Abra o terminal/cmd e navegue para a pasta extraída:

```bash
cd ecovalor
```

## 🗄️ Passo 2: Configurar Banco de Dados

### Opção A: MySQL Local

1. Abra o MySQL:
```bash
mysql -u root -p
```

2. Crie um banco de dados:
```sql
CREATE DATABASE ecovalor;
```

3. Crie um arquivo `.env.local` na raiz do projeto com:
```
DATABASE_URL=mysql://root:sua_senha@localhost:3306/ecovalor
```

### Opção B: MySQL em Nuvem (Planetscale - Gratuito)

1. Acesse https://planetscale.com e crie uma conta
2. Crie um novo banco de dados chamado `ecovalor`
3. Copie a string de conexão (MySQL)
4. Crie um arquivo `.env.local` com:
```
DATABASE_URL=mysql://seu_usuario:sua_senha@seu_host/ecovalor
```

## 📦 Passo 3: Instalar Dependências

```bash
pnpm install
```

Se não tiver `pnpm` instalado:
```bash
npm install -g pnpm
```

## 🗃️ Passo 4: Aplicar Migrações do Banco de Dados

```bash
pnpm drizzle-kit generate
pnpm drizzle-kit migrate
```

## 🔐 Passo 5: Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```env
# Banco de Dados
DATABASE_URL=mysql://root:sua_senha@localhost:3306/ecovalor

# OAuth (você pode usar valores de teste)
VITE_APP_ID=test-app-id


JWT_SECRET=seu_jwt_secret_aqui

# Informações do Proprietário
OWNER_OPEN_ID=test-owner
OWNER_NAME=Admin

# APIs opcionais para funcionalidades avançadas
BUILT_IN_FORGE_API_URL=
BUILT_IN_FORGE_API_KEY=sua_chave_aqui
VITE_FRONTEND_FORGE_API_URL=
VITE_FRONTEND_FORGE_API_KEY=sua_chave_aqui

# Analytics (opcional)
VITE_ANALYTICS_ENDPOINT=https://analytics.example.com
VITE_ANALYTICS_WEBSITE_ID=seu_id_aqui
```

## 🚀 Passo 6: Rodar o Projeto

```bash
pnpm dev
```

O servidor vai iniciar em `http://localhost:3000`

## 🌐 Acessar a Plataforma

1. Abra seu navegador e acesse: **http://localhost:3000**
2. Você verá a landing page pública
3. Para acessar o dashboard, você precisa fazer login (será necessário configurar OAuth ou usar um método de teste)

## 📁 Estrutura do Projeto

```
ecovalor/
├── client/              # Frontend React
│   └── src/
│       ├── pages/      # Páginas principais
│       ├── components/ # Componentes reutilizáveis
│       └── lib/        # Utilitários
├── server/             # Backend Express + tRPC
│   ├── routers.ts      # Procedures tRPC
│   └── db.ts           # Query helpers
├── drizzle/            # Schema do banco de dados
└── package.json        # Dependências
```

## 🛠️ Comandos Úteis

```bash
# Rodar em desenvolvimento
pnpm dev

# Build para produção
pnpm build

# Rodar em produção
pnpm start

# Testes
pnpm test

# Verificar tipos TypeScript
pnpm check

# Formatar código
pnpm format
```

## 🔑 Funcionalidades Principais

- **Landing Page**: Indicadores de impacto e economia circular
- **Dashboard**: KPIs, gráficos e atividades
- **Marketplace**: Compra e venda de resíduos
- **Gestão de Resíduos**: CRUD completo
- **Dashboard ESG**: Métricas ambientais
- **Área Financeira**: Receitas e transações
- **IA & Insights**: Sugestões de preço e buyer matching

## 🐛 Troubleshooting

### Erro: "Cannot find module 'mysql2'"
```bash
pnpm install
```

### Erro: "DATABASE_URL not set"
Verifique se o arquivo `.env.local` está na raiz do projeto e tem a variável `DATABASE_URL`

### Erro: "Port 3000 already in use"
```bash
# Mudar porta (edite vite.config.ts)
# Ou mate o processo que está usando a porta
```

### Banco de dados não conecta
1. Verifique se MySQL está rodando
2. Verifique a string de conexão em `.env.local`
3. Verifique usuário e senha

## 📞 Suporte

Se tiver problemas:
1. Verifique se Node.js e MySQL estão instalados
2. Verifique a variável `DATABASE_URL`
3. Limpe `node_modules` e reinstale: `rm -rf node_modules && pnpm install`

## 🎉 Pronto!

Agora você tem a plataforma EcoValor rodando localmente! Explore todas as funcionalidades e customize conforme necessário.

---

**Desenvolvido com ❤️ para economia circular e sustentabilidade**
