# Roteiro de apresentação — Gestão de Produtos (Angular 22)

Tarefa III.I · Angular 22 + OptimusUI 2 + Tailwind 4 · duração estimada: 10 a 12 minutos

Antes de começar, deixe a API (`backend`) e o frontend (`frontend`) rodando, o editor aberto na pasta `frontend/src/app` e o navegador em `localhost:4200` já deslogado.

## 1. Abertura (1 min)

**Fale:** "Fiz um CRUD de produtos com Angular 22, OptimusUI 2 e Tailwind 4. O produto tem 4 atributos: nome, descrição, preço e categoria. O backend é uma API Express com JWT, e o frontend usa signals do começo ao fim."

**Mostre:** a estrutura de pastas (`core`, `models`, `services`, `components`, `pages`, `layout`).

## 2. Login e proteção de rotas (2 min)

**Demonstre:**

1. Tente abrir `localhost:4200/produtos/novo` sem estar logado. Você será redirecionado para `/login` com `?returnUrl=`.
2. Faça login com `admin@exemplo.com` / `123456` e observe que volta para a tela pedida.

**Mostre no código:**

- `core/auth.service.ts`: o token e o usuário ficam em signals, e `logado` é um `computed` que também verifica a expiração do JWT.
- `core/auth.guard.ts`: devolve `true` ou um `UrlTree` para `/login`.
- `core/auth.interceptor.ts`: anexa `Authorization: Bearer` nas chamadas a `/api` e faz logout em caso de 401.
- `backend/server.js`: o middleware `autenticar` valida o token e protege todas as rotas `/api/produtos`.

**Prova da proteção da API:** no DevTools (Application → Local Storage), apague o `token` e recarregue a página. Você volta ao login. Se quiser, mostre também um `curl` em `/api/produtos` sem token, que retorna 401.

## 3. Componentes e comunicação por signals (2 min 30 s)

**Demonstre:** na lista, digite na busca e escolha uma categoria. Os cards de resumo e a tabela atualizam na hora.

**Mostre:** `pages/produto-list/produto-list.ts` como componente "container" e os três filhos em `components/`:

- `produto-filtro`: usa `model()` (via de mão dupla) para `busca` e `categoria`, `input()` para a lista de categorias e `output()` para o evento `limpar`.
- `produto-tabela`: recebe `produtos` por `input()` e emite `ver`, `editar` e `remover` por `output()`.
- `produto-resumo`: só recebe valores por `input()`.

**Frase-chave:** "Dados descem por `input` e `model`, eventos sobem por `output`, e o estado compartilhado fica no service."

No template do pai, mostre `[(busca)]="state.busca"`. É um `model()` ligado diretamente a um signal do service.

## 4. Services (1 min 30 s)

**Mostre os dois services lado a lado:**

- `produto-api.service.ts`: só fala HTTP, com `HttpClient` e os métodos `listar`, `obter`, `criar`, `atualizar` e `remover`.
- `produto-state.service.ts`: guarda o estado do frontend. `_produtos` é um signal privado exposto como `asReadonly()`, e `filtrados`, `categorias` e `valorTotal` são `computed`. Os métodos de escrita atualizam o signal com `tap`, então a tela muda sem recarregar da API.

**Frase-chave:** "Separei quem fala com a API de quem guarda o estado, então cada service tem uma responsabilidade."

## 5. Rotas (1 min)

**Mostre `app.routes.ts`:** `/login`, `/produtos`, `/produtos/novo`, `/produtos/:id`, `/produtos/:id/editar`, todas com `loadComponent` (lazy loading). As rotas de produtos ficam sob o `authGuard`, e `loginGuard` impede um usuário logado de voltar ao login.

**Destaque:** `withComponentInputBinding()` em `app.config.ts`. Por causa dele, o `:id` da URL chega como `input()` no componente.

## 6. Signal Forms (2 min)

**Demonstre:** clique em "Novo produto", tente salvar vazio (aparecem as mensagens de erro), depois preencha e salve (aparece o toast). Em seguida, edite um item.

**Mostre `pages/produto-form/produto-form.ts`:**

- O model é um `signal<ProdutoInput>`.
- `form(this.model, schema)` define as regras: `required`, `minLength`, `min` e um `validate` customizado.
- No template, `[formField]="f.nome"` liga cada campo ao form.
- `submit(this.f, async () => ...)` só executa a ação se o formulário for válido e já marca os campos como `touched`.
- O mesmo componente serve para cadastro e edição. Quando existe `id`, o `ngOnInit` busca o produto e faz `model.set(...)`, e os campos se preenchem sozinhos.

## 7. Comunicação com a API: HttpClient e httpResource (45 s)

- `HttpClient` aparece em `ProdutoApiService` e no `AuthService`.
- `httpResource` aparece em `pages/produto-detail/produto-detail.ts`: ` httpResource<Produto>(() =>  `/api/produtos/${this.id()}`)`. Ele recarrega sozinho quando o `id` muda, e o template usa `isLoading()`, `error()` e `hasValue()`.

**Demonstre:** clique em "Ver" em um produto e depois em "Excluir" (aparece o diálogo de confirmação e o toast).

## 8. Visual: OptimusUI + Tailwind (45 s)

**Mostre:**

- `styles.css` e `app.config.ts`: a ordem das camadas CSS (`@layer theme, base, optimus, components, utilities`) faz o Tailwind sobrescrever o OptimusUI.
- Exemplos de Tailwind em componentes do OptimusUI: `styleClass="!rounded-full"` no `p-tag` e `styleClass="w-full"` no `p-button`.
- Exemplos em HTML puro: o `<header>` com gradiente em `layout/header.ts` e o `<select>` em `produto-filtro.ts`.

## 9. Encerramento (30 s)

**Fale:** "Resumindo: componentes comunicando por signals, services separados para estado e API, Signal Forms no cadastro e na edição, rotas lazy com guard, HttpClient e httpResource, e JWT protegendo tanto o frontend quanto a API."

## Perguntas que o professor pode fazer

| Pergunta | Resposta curta |
| --- | --- |
| Por que `computed` em vez de calcular no template? | O valor é memorizado e só recalcula quando os signals de que depende mudam. |
| Diferença entre `input`, `output` e `model`? | `input` é dado que entra, `output` é evento que sai, e `model` é as duas coisas juntas (two-way). |
| Por que `asReadonly()` no signal de produtos? | Para que só o service altere a lista, evitando que um componente a modifique por fora. |
| Onde o JWT é validado? | No backend, no middleware `autenticar`. O guard do frontend só melhora a experiência, a segurança real está na API. |
| Qual o risco de guardar o token no `localStorage`? | Fica exposto a XSS. Em produção seria melhor um cookie `HttpOnly`. |
| O que acontece quando o token expira? | A API responde 401, o interceptor faz logout e o guard manda para o login. O `AuthService` também checa o `exp` do token ao carregar. |
| Por que `httpResource` no detalhe e `HttpClient` no resto? | `httpResource` é reativo e fica ótimo para leitura que depende de um signal. Para escrita (POST, PUT, DELETE) uso `HttpClient`. |
| Por que lazy loading? | Cada tela vira um chunk separado, então o carregamento inicial é menor. |
