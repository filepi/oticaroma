# Ótica Roma

Site institucional da **Ótica Roma** com React, Express e SQLite.

## Funcionalidades

- **Nossas Ofertas** — Carrossel dinâmico de óculos com página de detalhes
- **Clube de Benefícios** — Cadastro com nome, CPF, data de nascimento e upload de cupom fiscal (salvo no banco)
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
├── server/          # Express + SQLite
│   ├── uploads/     # Cupons fiscais enviados
│   └── oticaroma.db # Banco de dados (criado automaticamente)
└── package.json
```

## API

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/oculos` | Lista todos os óculos |
| GET | `/api/oculos/:id` | Detalhes de um óculos |
| POST | `/api/clube` | Cadastro no clube (multipart/form-data) |
