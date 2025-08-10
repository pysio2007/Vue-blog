# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **Pysio's Home**, a personal blog built with VuePress 2.0 and the Hope theme. It's a bilingual (Chinese/English) blog featuring interactive components, games, and tools.

## Development Commands

- `npm run docs:dev` - Start development server with hot reload
- `npm run docs:build` - Build static site for production  
- `npm run docs:clean-dev` - Start dev server with clean cache
- `npm run docs:update-package` - Update VuePress packages using vp-update

## Architecture

### VuePress Structure
- **src/** - Source content directory
  - **src/.vuepress/** - VuePress configuration and customizations
    - **config.ts** - Main VuePress configuration with plugins and locales
    - **theme.ts** - Hope theme configuration with git hash, runtime calculation, and blog settings
    - **client.ts** - Client-side enhancements, component registration, and Sentry integration
    - **components/** - Custom Vue components (28 interactive components)
    - **navbar.ts** - Navigation bar configuration
    - **sidebar/** - Sidebar configuration for both languages
    - **styles/** - Custom SCSS styling (config.scss, index.scss, palette.scss)
    - **public/** - Static assets including FontAwesome, icons, and images

### Content Organization
- **src/posts/** - Blog posts organized by category (daily, develop)
- **src/tools/** - Interactive tools (Pastebin, IP checker, Minecraft mod checker)
- **src/Game/** - Browser games (2048, Game of Life, Wordle, Langton's Ant)
- **src/other/** - Static pages (friends, issues, status)
- **src/en/** - English translations of all content

### Key Components
The site features 28+ custom Vue components registered in client.ts:
- Interactive games (Wordle, 2048, GameofLife, Langtonsant)
- Developer tools (console, GitCommits, GithubIssues, GitHubPRList)
- Network utilities (ipcheck, Connectivity, WebRTC, DNSLeak)
- Media components (AsciinemaPlayer, PictureList)
- Status monitors (SteamStatus, OnlineOrDead, StatusCheak)

### Theme Configuration
- **Bilingual support** - Chinese (default) and English locales
- **Dark mode** - Switch-based dark mode toggle
- **Blog features** - Categories, tags, reading time, page views
- **Search** - Meilisearch integration
- **Comments** - Waline comment system with Turnstile protection
- **PWA** - Progressive Web App with caching
- **Analytics** - Google Analytics and Umami tracking
- **RSS feeds** - Automatic RSS generation

### Build & Deployment
- **Bundler** - Vite bundler for fast builds
- **TypeScript** - ES2022 target with NodeNext module resolution
- **Docker** - Nginx-based containerization
- **Git integration** - Dynamic git hash display in footer
- **Runtime tracking** - Live uptime calculation from October 2, 2024

### Dependencies
- **VuePress 2.0.0-rc.24** with Hope theme
- **Vue 3.5.18** with TypeScript support
- **Chart.js, ECharts, Mermaid** - Data visualization
- **Monaco Editor** - Code editing capabilities
- **Sentry** - Error tracking and performance monitoring
- **Waline** - Comment system
- **FontAwesome** - Icon system

## Development Notes

### Adding New Components
1. Create Vue component in `src/.vuepress/components/`
2. Register component in `client.ts` enhance function
3. Import and add to component registration list

### Content Management
- All markdown files support Vue components via `<component-name />`
- Blog posts automatically extract metadata (date, author, tags)
- Bilingual content requires parallel file structure in `/en/`

### Styling
- Global styles in `src/.vuepress/styles/`
- Uses SCSS with Hope theme variables
- JetBrains Mono font loaded from Google Fonts
- Custom FontAwesome integration

### External Integrations
- **Meilisearch** for site search at meilisearch.pysio.online
- **Waline** comments at waline.pysio.online
- **Sentry** error tracking with session replays
- **Umami** analytics at umami.pysio.online
- **Google Analytics** with ID G-G9Q1H2C9MN