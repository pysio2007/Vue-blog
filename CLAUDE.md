# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **Pysio's Home**, a personal blog built with VuePress 2.0 and the Hope theme. It's a bilingual (Chinese/English) blog featuring interactive components, games, and tools.

## Development Commands

- `npm run docs:dev` - Start development server with hot reload
- `npm run docs:build` - Build static site for production
- `npm run docs:clean-dev` - Start dev server with clean cache
- `npm run docs:update-package` - Update VuePress packages using vp-update (requires bun)

**Docker Deployment:**
```bash
docker pull pysio/pysioblog
docker run --name PysioHome -p 80:80 -p 443:443 -d pysio/pysioblog:main
```

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

### Markdown Features
The theme supports extensive markdown enhancements configured in `theme.ts`:
- **Charts** - Chart.js and ECharts integration
- **Diagrams** - Mermaid, Flowchart.ts, PlantUML
- **Math** - Support for KaTeX and MathJax (not simultaneously enabled)
- **Code** - Prismjs syntax highlighting with light/dark themes (one-light/nord), Vue playground, code tabs
- **Interactive** - Demo components, Vue component embedding in markdown
- **Media** - Figure with lazy loading, image marking, Obsidian image size syntax
- **Presentation** - Reveal.js with plugins for slides
- **Styling** - Text alignment, spoiler, hint boxes, alerts, mark highlighting, task lists, superscript/subscript, footnotes
- **Playground** - TypeScript and Vue presets with @vue/repl

### Build & Deployment
- **Bundler** - Vite bundler for fast builds with filesystem cache
- **TypeScript** - ES2022 target with NodeNext module resolution
- **Docker** - Multi-stage build with Bun and Nginx Alpine, includes SSL certificates
- **Git integration** - Dynamic git hash display in footer via git-describe
- **Runtime tracking** - Live uptime calculation from October 2, 2024, 19:28 CST

### Dependencies
- **VuePress 2.0.0-rc.26** with vuepress-theme-hope 2.0.0-rc.102
- **Vue 3.5.27** with TypeScript support
- **Vite bundler** - Fast build times with hot module replacement
- **Data visualization** - Chart.js, ECharts, Mermaid, Flowchart.ts
- **Code editing** - Monaco Editor with webpack plugin
- **Math rendering** - KaTeX and MathJax support
- **Media playback** - Asciinema player
- **Error tracking** - Sentry with browser integration and session replay
- **Comments** - Waline client
- **Interactive demos** - Vue Repl for interactive playgrounds

## Development Notes

### Adding New Components
1. Create Vue component in `src/.vuepress/components/`
2. Import component in `client.ts`
3. Register in the `enhance` function using `app.component('ComponentName', Component)`
4. Components can then be used in markdown files as `<component-name />`

### Content Management
- All markdown files support Vue components via `<component-name />`
- Blog posts automatically extract metadata (date, author, tags)
- Bilingual content requires parallel file structure: Chinese content in `/src/` and English in `/src/en/`
- Encrypted pages are configured in `theme.ts` under the `encrypt` config (e.g., `/tools/mcmod.html` with password "mcmod")

### Styling
- Global styles in `src/.vuepress/styles/`
- Uses SCSS with Hope theme variables
- JetBrains Mono font loaded from Google Fonts
- Custom FontAwesome integration via `/assets/fontawesome/css/all.css`

### Custom Plugins
Located in `src/.vuepress/plugins/`:
- **telegram-instant-view.ts** - Adds Telegram Instant View support with meta tags
- **og-image-plugin.ts** - Generates Open Graph images for social sharing

### Git Integration
- Git hash is dynamically injected at build time using `git-describe`
- Hash is displayed in footer and accessible via `process.env.VUE_APP_GIT_HASH`
- Runtime counter calculates uptime from October 2, 2024, 19:28 CST

### Router Behavior
- `/sponsor` route redirects to Stripe donation page
- NFC card detection on iOS devices triggers when URL contains `nfc=1`, `source=nfc`, or referrer is `shortcuts://`

### External Integrations
- **Meilisearch** - Site search at meilisearch.pysio.online (index: pysioblog)
- **Waline** - Comment system at waline.pysio.online with Turnstile protection
- **Sentry** - Error tracking with session replay integration (DSN configured in client.ts)
- **Umami** - Analytics at umami.pysio.online
- **Google Analytics** - ID G-G9Q1H2C9MN with AdSense integration
- **Telegram Instant View** - Optimized meta tags for Telegram article previews
- **Open Graph** - Dynamic OG image generation for social sharing

### Special Networks
- **Tor Onion Service**: http://zwlvi475lpbann6njjdatf2zh7gkao3sdsqrejto6ldoxdvc4okwyqyd.onion/
- **DN42**: https://pysio.dn42/