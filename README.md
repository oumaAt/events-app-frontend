# Event Manager — Frontend

A React application for managing events with filtering, search, and dark mode support.

## Features

- **Authentication** — register, login and logout
- **Event management** — create, list and delete events
- **Filtering & search** — filter by status and category, search by title
- **Dark / light mode** — toggle via a custom `useDarkMode` hook
- **Form validation** — schema-based validation with Zod

## Tech Stack

- **React 19**
- **Redux Toolkit + RTK Query** — state management and API calls
- **React Router DOM** — client-side routing
- **TailwindCSS** — utility-first styling
- **Zod** — form validation
- **Vite** — build tool
- **ESLint + Prettier** — code quality and formatting

## Getting Started

```bash
npm install
npm run dev
```

## Environment Variables

Copy `.env.example` and fill in your API base URL:

```bash
cp .env.example .env
```
