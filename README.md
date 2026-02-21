# 🏠 Vladia Corretora - Sistema de Gestão de Imóveis

Sistema completo para gestão de imóveis com autenticação JWT, integração com mapas e interface moderna.

---

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Tecnologias](#-tecnologias)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Como Usar](#-como-usar)
- [Funcionalidades](#-funcionalidades)
- [Autenticação](#-autenticação)
- [API de Mapas](#-api-de-mapas)
- [Scripts Disponíveis](#-scripts-disponíveis)
- [Solução de Problemas](#-solução-de-problemas)

---

## 🎯 Sobre o Projeto

O **Vladia Corretora** é um sistema web completo para gerenciamento de imóveis, desenvolvido para corretoras de imóveis. Permite cadastro, busca, visualização detalhada de propriedades, além de sistema de autenticação com diferentes níveis de acesso.

### ✨ Principais Características

- ✅ **Autenticação JWT** com proteção de rotas
- ✅ **Tipos de usuário**: Admin, Corretor e Cliente
- ✅ **CRUD completo** de imóveis
- ✅ **Integração com mapas** (OpenStreetMap - 100% gratuito)
- ✅ **Sistema de filtros** e busca avançada
- ✅ **Interface moderna** e responsiva
- ✅ **Upload de imagens** de imóveis
- ✅ **Geolocalização automática** de endereços

---

## 🚀 Tecnologias

### Frontend
- **React 18** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool moderna e rápida
- **React Router** - Roteamento SPA
- **Axios** - Cliente HTTP
- **CSS3** - Estilização customizada

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **TypeScript** - Tipagem estática
- **JWT** - Autenticação
- **bcryptjs** - Hash de senhas
- **OpenStreetMap Nominatim** - API de mapas gratuita

---

## 🏗️ Estrutura do Projeto

```
vladia-corretora/
│
├── frontend/                    # Aplicação React
│   ├── public/
│   │   └── assets/             # Imagens, logos, backgrounds
│   ├── src/
│   │   ├── components/         # Componentes React
│   │   │   ├── Header.tsx
│   │   │   └── PrivateRoute.tsx
│   │   ├── contexts/           # Context API
│   │   │   └── AuthContext.tsx
│   │   ├── pages/              # Páginas da aplicação
│   │   │   ├── Home.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Registro.tsx
│   │   │   ├── Imoveis.tsx
│   │   │   ├── CadastrarImovel.tsx
│   │   │   ├── DetalhesImovel.tsx
│   │   │   └── AreaCorretor.tsx
│   │   ├── services/           # Serviços de API
│   │   │   └── api.ts
│   │   ├── styles/             # Arquivos CSS
│   │   └── utils/              # Utilitários
│   └── package.json
│
├── backend/                     # API Node.js
│   ├── src/
│   │   ├── controllers/        # Controladores
│   │   │   ├── auth.controller.ts
│   │   │   ├── imoveis.controller.ts
│   │   │   └── maps.controller.ts
│   │   ├── middlewares/        # Middlewares
│   │   │   └── auth.middleware.ts
│   │   ├── routes/             # Rotas da API
│   │   │   ├── auth.routes.ts
│   │   │   ├── imoveis.routes.ts
│   │   │   ├── maps.routes.ts
│   │   │   └── index.ts
│   │   ├── types/              # Tipos TypeScript
│   │   │   ├── user.types.ts
│   │   │   ├── imovel.types.ts
│   │   │   └── express.d.ts
│   │   ├── utils/              # Utilitários
│   │   │   ├── database.ts
│   │   │   ├── helpers.ts
│   │   │   └── logger.ts
│   │   └── server.ts           # Servidor Express
│   └── package.json
│
├── package.json                 # Workspace raiz
├── RODAR.bat                   # Script de inicialização (Windows)
└── README.md                   # Este arquivo
```

---

## 📦 Instalação

### Pré-requisitos

- **Node.js** 18+ 
- **npm** ou **yarn**

### Passo 1: Clonar o Repositório

```bash
git clone <url-do-repositorio>
cd Projeto Vladia-Corretora
```

### Passo 2: Instalar Dependências

```bash
# Instalar dependências de todo o projeto
npm install

# Ou instalar manualmente em cada pasta
cd frontend && npm install
cd ../backend && npm install
```

---

## ⚙️ Configuração

### Frontend - `.env`

Crie o arquivo `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

### Backend - `.env`

Crie o arquivo `backend/.env`:

```env
# Servidor
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=vladia-corretora-secret-key-2024
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:3000

# Database (opcional - atualmente usa armazenamento em memória)
MONGODB_URI=mongodb://localhost:27017/vladia-corretora
```

---

## 🎮 Como Usar

### Opção 1: Iniciar Tudo de Uma Vez (Recomendado)

```bash
# Na raiz do projeto
npm run dev
```

Ou simplesmente clique duplo no arquivo **`RODAR.bat`** (Windows)

### Opção 2: Iniciar Separadamente

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Acessar o Sistema

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api
- **Health Check:** http://localhost:5000/health

---

## 🔐 Autenticação

### Usuário Padrão

Ao iniciar o sistema pela primeira vez, use estas credenciais:

- **Email:** `admin@vladiacorretora.com`
- **Senha:** `admin123`
- **Tipo:** Administrador

### Criar Nova Conta

1. Acesse a tela de Login
2. Clique em "Cadastre-se"
3. Preencha os dados
4. Você será automaticamente logado

### Tipos de Usuário

| Tipo | Permissões |
|------|-----------|
| **Admin** | Acesso completo ao sistema |
| **Corretor** | Gerenciar imóveis, visualizar leads |
| **Cliente** | Visualizar e favoritar imóveis |

### Rotas Protegidas

Todas as rotas, exceto `/login` e `/registro`, requerem autenticação. O sistema redireciona automaticamente usuários não autenticados para a página de login.

### API de Autenticação

#### POST `/api/auth/register`
Registra um novo usuário.

**Body:**
```json
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "senha": "senha123",
  "telefone": "(11) 99999-9999",
  "tipo": "cliente"
}
```

#### POST `/api/auth/login`
Autentica um usuário.

**Body:**
```json
{
  "email": "admin@vladiacorretora.com",
  "senha": "admin123"
}
```

**Resposta:**
```json
{
  "user": {
    "id": "123",
    "nome": "Admin",
    "email": "admin@vladiacorretora.com",
    "tipo": "admin"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### GET `/api/auth/profile`
Retorna dados do usuário autenticado (requer token).

**Headers:**
```
Authorization: Bearer {token}
```

---

## 🗺️ API de Mapas

O sistema utiliza **OpenStreetMap Nominatim** - uma API 100% gratuita, sem necessidade de cartão de crédito ou chave de API.

### Vantagens

- ✅ **100% Gratuito** - Sem custos ocultos
- ✅ **Sem Cadastro** - Não precisa de conta
- ✅ **Sem Limites Rígidos** - Uso justo
- ✅ **Dados Excelentes** - Cobertura mundial
- ✅ **Sem Cartão** - Não solicita billing

### Endpoints

#### POST `/api/maps/geocode`
Converte endereço em coordenadas.

**Body:**
```json
{
  "endereco": "Rua Joaquim Martins 398, Fortaleza, CE"
}
```

**Resposta:**
```json
{
  "latitude": -3.7318616,
  "longitude": -38.5266704,
  "enderecoFormatado": "Rua Joaquim Martins, 398, Dionísio Torres, Fortaleza, Ceará, Brasil"
}
```

#### POST `/api/maps/reverse-geocode`
Converte coordenadas em endereço.

**Body:**
```json
{
  "latitude": -3.7318616,
  "longitude": -38.5266704
}
```

### Dicas para Busca de Endereços

**✅ Formatos que funcionam bem:**
- `Rua Joaquim Martins 398 Fortaleza CE`
- `Avenida Beira Mar Fortaleza`
- `Shopping Iguatemi Fortaleza`
- `Aeroporto Internacional Pinto Martins`

---

## ⚡ Funcionalidades

### 🏠 Gestão de Imóveis

- [x] Cadastro de imóveis com fotos
- [x] Listagem com filtros avançados
- [x] Busca por tipo, preço, área, localização
- [x] Visualização detalhada
- [x] Edição e exclusão
- [x] Geolocalização automática
- [x] Status (Disponível, Vendido, Alugado)

### 🔐 Sistema de Autenticação

- [x] Registro de usuários
- [x] Login com JWT
- [x] Proteção de rotas
- [x] Persistência de sessão
- [x] Níveis de acesso (Admin, Corretor, Cliente)
- [x] Logout seguro

### 🎨 Interface

- [x] Design moderno e responsivo
- [x] Header com navegação
- [x] Cards de imóveis uniformes
- [x] Sistema de filtros
- [x] Galeria de imagens
- [x] Formatação de valores (R$, m²)

### 🗺️ Mapas e Localização

- [x] Busca de endereço (Geocoding)
- [x] Conversão coordenadas ↔ endereço
- [x] Integração OpenStreetMap
- [x] Sem custos ou limitações

---

## 📜 Scripts Disponíveis

### Raiz do Projeto

```bash
npm run dev              # Inicia frontend + backend
npm run dev:frontend     # Inicia apenas frontend
npm run dev:backend      # Inicia apenas backend
npm run build            # Build de produção (ambos)
npm run install:all      # Instala todas as dependências
```

### Frontend (cd frontend)

```bash
npm run dev       # Servidor de desenvolvimento (porta 3000)
npm run build     # Build para produção
npm run preview   # Preview do build de produção
npm run lint      # Verificar código com ESLint
```

### Backend (cd backend)

```bash
npm run dev       # Servidor de desenvolvimento com tsx (porta 5000)
npm run build     # Compila TypeScript para JavaScript
npm run start     # Executa versão compilada
npm run lint      # Verificar código com ESLint
```

---

## 🐛 Solução de Problemas

### Porta já em uso

**Erro:** `Port 3000 is already in use` ou `Port 5000 is already in use`

**Solução (Windows):**
```powershell
# Matar processo na porta 3000
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force

# Matar processo na porta 5000
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process -Force
```

### Erro: Cannot find module

**Solução:**
```bash
# Remover node_modules e reinstalar
rm -rf node_modules
npm install

# Ou no Windows PowerShell
Remove-Item -Recurse -Force node_modules
npm install
```

### Token Expirado

**Problema:** Mensagem "Token expirado" ao acessar páginas

**Solução:**
1. Faça logout
2. Faça login novamente
3. Token tem validade de 7 dias

### Imagens não aparecem

**Solução:**
1. Verifique se as imagens estão em `frontend/public/assets/`
2. Recarregue a página com Ctrl + F5
3. Reinicie o servidor frontend

### Erro de CORS

**Problema:** Erro de Cross-Origin ao fazer requisições

**Solução:**
1. Verifique se o backend está rodando na porta 5000
2. Verifique se `CORS_ORIGIN=http://localhost:3000` está no `.env` do backend
3. Reinicie o backend

### Busca de endereço não funciona

**Solução:**
1. Verifique se o backend está rodando
2. Tente um endereço mais completo: `Rua, Número, Cidade, Estado`
3. Verifique os logs do backend no terminal

---

## 📚 Estrutura de Dados

### Interface Imovel

```typescript
{
  id: string
  titulo: string
  tipo: 'casa' | 'apartamento' | 'terreno' | 'comercial'
  endereco: string
  enderecoFormatado?: string
  latitude?: number
  longitude?: number
  preco: number
  area: number
  quartos?: number
  banheiros?: number
  vagas?: number
  descricao: string
  imagens?: string[]
  status: 'disponivel' | 'vendido' | 'alugado'
  criadoEm: Date
  atualizadoEm?: Date
}
```

### Interface User

```typescript
{
  id: string
  nome: string
  email: string
  senha: string  // hashada com bcrypt
  telefone?: string
  tipo: 'admin' | 'corretor' | 'cliente'
  criadoEm: Date
}
```

---

## 🔒 Segurança

### Backend
- ✅ Senhas hashadas com bcrypt (10 rounds)
- ✅ Tokens JWT com expiração de 7 dias
- ✅ Validação de dados de entrada
- ✅ Middleware de autenticação
- ✅ Proteção contra SQL Injection
- ✅ CORS configurado

### Frontend
- ✅ Token armazenado no localStorage
- ✅ Proteção de rotas com `PrivateRoute`
- ✅ Redirecionamento automático
- ✅ Interceptor Axios com token
- ✅ Validação de formulários

---

## 🎯 Roadmap

### Próximas Funcionalidades

- [ ] Integrar banco de dados real (MongoDB/PostgreSQL)
- [ ] Sistema de favoritos
- [ ] Chat entre corretor e cliente
- [ ] Painel administrativo completo
- [ ] Dashboard com estatísticas
- [ ] Exportação de relatórios (PDF)
- [ ] Sistema de notificações por email
- [ ] Recuperação de senha
- [ ] Verificação de email
- [ ] Autenticação de dois fatores (2FA)
- [ ] Integração com WhatsApp
- [ ] Sistema de agendamento de visitas
- [ ] Comparação de imóveis

---

## 📄 Licença

Este projeto foi desenvolvido para **Vladia Corretora**.

---

## 👨‍💻 Desenvolvido com ❤️

Sistema criado para modernizar e agilizar a gestão de imóveis da Vladia Corretora.

**Dúvidas ou sugestões?** Entre em contato!

---

**Versão:** 1.0.0  
**Última atualização:** Outubro 2024
