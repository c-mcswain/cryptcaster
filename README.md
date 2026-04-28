# CryptoCaster

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)] [![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/c-mcswain/cryptcaster)

A production-ready full-stack chat application built with Cloudflare Workers, React, and shadcn/ui. Features real-time chat boards with Durable Objects for stateful entities (users, chats, messages), type-safe TypeScript, and a beautiful, responsive UI.

## ✨ Features

- **Full-Stack Architecture**: React 18 frontend with TanStack Query for data fetching, Hono-powered Cloudflare Workers backend.
- **Durable Objects**: Per-entity storage for users and chat boards with built-in indexing for listing/pagination.
- **Modern UI**: shadcn/ui components, Tailwind CSS with custom design system, dark mode support.
- **Type-Safe**: End-to-end TypeScript with shared types between frontend and worker.
- **Developer Experience**: Hot reload, error boundaries, theme toggle, sidebar layout.
- **Production-Ready**: CORS, logging, error handling, pagination, optimistic updates.
- **Deployment**: One-command deploy to Cloudflare Workers with SPA asset handling.

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, Lucide icons, TanStack Query, React Router, Sonner (toasts), Framer Motion.
- **Backend**: Cloudflare Workers, Hono, Durable Objects (SQLite-backed).
- **State & Utils**: Zustand, Immer, clsx, Tailwind Merge.
- **Dev Tools**: Bun, ESLint, Wrangler.

## 🚀 Quick Start

1. **Clone & Install**:
   ```bash
   git clone <your-repo-url>
   cd cryptcaster-mjspltyltz1cerrsgov_o
   bun install
   ```

2. **Development**:
   ```bash
   bun dev
   ```
   Opens at `http://localhost:3000` (or `$PORT`).

3. **Build & Preview**:
   ```bash
   bun build
   bun preview
   ```

## 📋 Available Scripts

| Script | Description |
|--------|-------------|
| `bun dev` | Start dev server with hot reload |
| `bun build` | Build for production |
| `bun lint` | Run ESLint |
| `bun preview` | Local preview of production build |
| `bun deploy` | Build + deploy to Cloudflare |
| `bun cf-typegen` | Generate Worker types |

## 🔧 Development Workflow

- **Frontend**: Edit files in `src/`. Uses Vite for fast HMR.
- **Backend**: Add routes in `worker/user-routes.ts`. Uses entities from `worker/entities.ts`.
- **Shared Types**: Define in `shared/types.ts` for frontend/backend sync.
- **Entities**: Extend `IndexedEntity` in `worker/entities.ts` for new models with auto-indexing/seeding.
- **API Client**: Use `api()` from `src/lib/api-client.ts` for type-safe fetches.
- **UI Components**: shadcn/ui pre-installed in `src/components/ui/`. Add more via `npx shadcn-ui@latest add <component>`.

### Example API Usage (Frontend)

```tsx
import { api } from '@/lib/api-client';
import type { User } from '@shared/types';

// List users
const users = await api<User[]>('/api/users');

// Create chat
const chat = await api('/api/chats', {
  method: 'POST',
  body: JSON.stringify({ title: 'My Chat' })
});
```

### Example Entity Usage (Worker)

See `worker/entities.ts` and `worker/user-routes.ts` for users/chats/messages.

## ☁️ Deployment

Deploy to Cloudflare Workers with one command:

```bash
bun deploy
```

This builds assets and runs `wrangler deploy`.

**Manual Steps** (if needed):
1. Install Wrangler: `bunx wrangler@latest login`
2. Configure: Edit `wrangler.jsonc` for custom bindings/migrations.
3. Deploy: `bunx wrangler deploy`
4. Types: `bun cf-typegen` after deploy.

[Deploy to Cloudflare Workers][![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/c-mcswain/cryptcaster)

**Custom Domain**: Add via Wrangler dashboard or `wrangler deploy --name my-app`.

## 🤝 Contributing

1. Fork & clone.
2. `bun install`.
3. Make changes, `bun lint`.
4. Test locally: `bun dev`.
5. PR with clear description.

## 📄 License

MIT. See [LICENSE](LICENSE) for details.

## 🙌 Support

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Hono](https://hono.dev/)

Built with ❤️ for Cloudflare Workers.