# Ótica Roma — Client

Frontend do site institucional da **Ótica Roma**, feito com React, TypeScript e Vite.

## Pré-requisitos

- Node.js 20+

## Instalação

Na raiz do repositório:

```bash
npm install
npm install --prefix client
npm install --prefix server
```

Ou apenas nesta pasta:

```bash
npm install
```

## Rodar em localhost

### Frontend e backend juntos (recomendado)

Na raiz do repositório:

```bash
npm run dev
```

- Frontend: http://localhost:5173
- API: http://localhost:3001

### Apenas o frontend

Nesta pasta:

```bash
npm run dev
```

Ou, a partir da raiz:

```bash
npm run dev:client
```

O app ficará disponível em http://localhost:5173.

> Para cadastro no Clube de Benefícios e demais funcionalidades que usam a API, o backend também precisa estar rodando (`npm run dev:server` na raiz ou `npm run dev` na raiz).

## Outros comandos

```bash
npm run build    # Build de produção
npm run preview  # Preview do build (localhost)
npm run lint     # ESLint
```
