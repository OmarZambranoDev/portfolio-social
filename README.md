# Portfolio Social

[![CI](https://github.com/OmarZambranoDev/portfolio-social/actions/workflows/ci.yml/badge.svg)](https://github.com/OmarZambranoDev/portfolio-social/actions/workflows/ci.yml)

Twitter-style social feed micro-frontend remote for the portfolio platform. Built with Vite + React + TypeScript, deployed as a Module Federation remote.

## Overview

- Twitter-style feed with infinite scroll and new post banner
- Post creation, likes, and comments with optimistic updates
- Following system with follow/unfollow and mutual follows
- User profiles with editable bio, post history, and portfolio links
- User search with debounced input and sorted results
- Real-time notification system with bell icon and detail view
- Post detail view for notification navigation
- Simulation engine generating posts, comments, likes, and follows
- Earth-tone theme with shared `@OmarZambranoDev/portfolio-ui` components
- Module Federation remote consumed by the Vite host shell
- Mobile-responsive with bottom navigation and notification center
- Unit tests with Vitest, E2E tests with Playwright, Lighthouse CI

## Tech Stack

| Category   | Technology                            |
| ---------- | ------------------------------------- |
| Framework  | React 18.2                            |
| Build Tool | Vite 5                                |
| Language   | TypeScript 5.2                        |
| Styling    | Tailwind CSS 3.4                      |
| State      | Zustand 4.5                           |
| Dates      | date-fns 3.3                          |
| Icons      | Lucide React                          |
| Shared UI  | `@OmarZambranoDev/portfolio-ui`       |
| Testing    | Vitest + Testing Library + Playwright |
| CI         | GitHub Actions + Lighthouse CI        |

## Getting Started

### Prerequisites

- Node.js 18+
- GitHub Packages access for `@OmarZambranoDev/portfolio-ui`

### Install

```bash
npm install
```

### Development

```bash
npm run dev
```

Runs on **http://localhost:3004** with CORS enabled.

### Build

```bash
npm run build
```

Outputs to `dist/` with Module Federation `remoteEntry.js` and `assets/style.css`.

### Preview

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

### Test

Unit tests

```bash
npm test
```

E2E tests

```bash
npx playwright test
```

### Lighthouse

```bash
npm run lhci
```

## Module Federation

| Config       | Value                                |
| ------------ | ------------------------------------ |
| Name         | `social`                             |
| Remote Entry | `remoteEntry.js`                     |
| Exposes      | `./SocialApp` → `./src/App`          |
| Exposes      | `./SocialStyles` → `./src/index.css` |
| Deployed URL | `[VERCEL_URL]`                       |

Shared dependencies (singletons):

- `react`
- `react-dom`
- `@OmarZambranoDev/portfolio-ui`
- `zustand`

## Project Structure

```
src/
├── components/
│   ├── common/
│   │   ├── Header.tsx
│   │   ├── MutualFollowsList.tsx
│   │   ├── NewPostInput.tsx
│   │   ├── PostCard.tsx
│   │   ├── PostDetailView.tsx
│   │   ├── ProfileHeader.tsx
│   │   ├── ProfileLinks.tsx
│   │   └── UserCard.tsx
│   ├── desktop/
│   │   ├── DesktopLayout.tsx
│   │   ├── FeedView.tsx
│   │   ├── FollowingView.tsx
│   │   ├── ProfileView.tsx
│   │   └── SearchView.tsx
│   └── mobile/
│       ├── MobileFeedView.tsx
│       ├── MobileFollowingView.tsx
│       ├── MobileLayout.tsx
│       ├── MobileNotificationsView.tsx
│       ├── MobileProfileView.tsx
│       └── MobileSearchView.tsx
├── data/
│   └── mockData.ts
├── hooks/
│   ├── useIsMobile.ts
│   ├── usePostCard.ts
│   └── useSimulationTimers.ts
├── store/
│   └── socialStore.ts
├── types/
│   └── social.ts
├── App.tsx
├── main.tsx
└── index.css
```

## Scripts

| Script           | Description                              |
| ---------------- | ---------------------------------------- |
| `dev`            | Start dev server on port 3004            |
| `build`          | TypeScript check + Vite production build |
| `preview`        | Preview production build                 |
| `test`           | Run Vitest unit tests                    |
| `test:watch`     | Run tests in watch mode                  |
| `lint`           | Run ESLint with max-warnings 0           |
| `format`         | Run Prettier on source files             |
| `lhci`           | Build and run Lighthouse CI audit        |
| `fetch-versions` | Fetch canonical versions from host       |
| `check-versions` | Check installed versions match host      |

## Deployment

Deployed to Vercel with CORS headers configured in `vercel.json`.

## License

MIT
