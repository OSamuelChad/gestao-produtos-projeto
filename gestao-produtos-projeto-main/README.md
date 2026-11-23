# Gestão de Produtos — Tarefa III.I (Angular 22 + OptimusUI 2 + Tailwind 4)

Aplicação fullstack com CRUD de **Produtos** (`nome`, `descricao`, `preco`, `categoria`), autenticação **JWT**, rotas protegidas e API REST própria.

```
.
├── backend/    API REST (Node + Express + JWT)  -> http://localhost:3000/api
└── frontend/   Angular 22 + OptimusUI 2 + Tailwind 4 -> http://localhost:4200
```

## Como executar

Requisitos: Node 20+ (testado com Node 22).

```bash
# Terminal 1 — API
cd backend
npm install
npm start

# Terminal 2 — Frontend
cd frontend
npm install
npm start          # ng serve com proxy: /api -> http://localhost:3000
```

Acesse http://localhost:4200 e entre com **admin@exemplo.com / 123456**.

## Onde está cada requisito da avaliação

| Requisito | Onde |
|---|---|
| Angular 22, OptimusUI 2, Tailwind 4 | `frontend/package.json`, `.postcssrc.json`, `src/styles.css`, `src/app/app.config.ts` |
| Model com 4 atributos | `src/app/models/produto.ts` (`nome`, `descricao`, `preco`, `categoria`) |
| Componentes menores + comunicação por **signals** | `src/app/components/` — `produto-filtro` (`model()` + `input()` + `output()`), `produto-tabela` (`input()` + `output()`), `produto-resumo` (`input()`); orquestrados por `pages/produto-list` |
| **Services** com estado | `services/produto-state.service.ts` (signals, `computed`, filtros) e `services/produto-api.service.ts` (HttpClient) |
| **Signal Forms** (cadastro e edição) | `pages/produto-form/produto-form.ts` (`form()`, `[formField]`, `required`, `minLength`, `min`, `submit`) e `pages/login/login.ts` |
| **Rotas** | `src/app/app.routes.ts` — `/login`, `/produtos`, `/produtos/novo`, `/produtos/:id`, `/produtos/:id/editar` (lazy loading) |
| **HttpClient / httpResource** | `ProdutoApiService` (HttpClient) e `pages/produto-detail` (`httpResource`) |
| Login, rotas protegidas e API protegida (bônus) | `core/auth.service.ts`, `core/auth.guard.ts`, `core/auth.interceptor.ts`; no backend, middleware `autenticar` em `backend/server.js` |
| Tailwind em ajustes de OptimusUI e HTML puro | `styleClass`/`class` nos `p-button`, `p-tag`, `pInputText`; utilitários em `<div>`, `<header>`, `<select>` etc. As camadas CSS (`@layer`) estão ordenadas para o Tailwind sobrescrever o OptimusUI |

## Endpoints da API

| Método | Rota | Auth |
|---|---|---|
| POST | `/api/auth/login` | pública |
| GET | `/api/produtos` | JWT |
| GET | `/api/produtos/:id` | JWT |
| POST | `/api/produtos` | JWT |
| PUT | `/api/produtos/:id` | JWT |
| DELETE | `/api/produtos/:id` | JWT |

Os dados ficam em `backend/data.json` (criado automaticamente com 4 produtos de exemplo). O segredo do JWT pode ser trocado pela variável `JWT_SECRET`.

## Roteiro para a apresentação

1. **Componentes**: `produto-list` (página) → `produto-filtro`, `produto-resumo`, `produto-tabela`.
2. **Signals**: dados descem por `input()`/`model()`, eventos sobem por `output()`; o estado compartilhado vive no `ProdutoStateService`.
3. **Services**: `ProdutoStateService` (estado) × `ProdutoApiService` (HTTP).
4. **Signal Forms**: model como `signal`, regras em `form(...)`, `submit()` só executa se válido; o mesmo componente atende cadastro e edição.
5. **Rotas**: `app.routes.ts`, parâmetro `:id` chegando como `input()` (`withComponentInputBinding`).
6. **API**: `HttpClient` nos services e `httpResource` no detalhe.
7. **Segurança**: login → JWT no `localStorage` → interceptor envia `Authorization: Bearer` → guard bloqueia rotas → API devolve 401 sem token (e o interceptor faz logout).
