# Ótica Roma

Site institucional da **Ótica Roma** com React e Express.

## Funcionalidades

- **Nossas Ofertas** — Carrossel dinâmico de óculos com página de detalhes
- **Clube de Benefícios** — Cadastro com nome, CPF, data de nascimento e upload de cupom fiscal
- **Fale Conosco** — QR Code e link direto para WhatsApp (+55 81 98113-1116)

## Pré-requisitos

- Node.js 20+

## Como rodar

```bash
# Instalar dependências (raiz, client e server)
npm install
npm install --prefix client
npm install --prefix server

# Rodar frontend e backend juntos
npm run dev
```

- Frontend: http://localhost:5173
- API: http://localhost:3001

## Estrutura

```
oticaroma/
├── client/          # React (Vite + TypeScript)
│   └── src/data/    # Catálogo de óculos (estático)
├── server/          # Express API (Clube de Benefícios)
│   └── uploads/     # Cupons fiscais enviados
└── package.json
```

## API

O catálogo de óculos fica no frontend (`client/src/data/oculos.ts`) para funcionar no Netlify sem backend.

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/clube` | Cadastro no clube (multipart/form-data) — requer backend em execução |
