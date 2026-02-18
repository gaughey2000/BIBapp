# BIB Aesthetics Website

Marketing site for BIB Aesthetics, built with React + Vite.

## Quick Start

```bash
npm run install-all
npm run dev
```

## Build

```bash
npm run build
```

## Deploy & Host

This project is configured for static hosting with SPA routing support.

### Netlify

`netlify.toml` is included at the repo root.

1. Connect the GitHub repo in Netlify.
2. Use default settings (Netlify will read `netlify.toml`):
3. Build command: `npm run build`
4. Publish directory: `client/dist`
5. Deploy.

### Vercel

`vercel.json` is included at the repo root.

1. Import the GitHub repo in Vercel.
2. Vercel will use:
3. Install command: `npm run install-all`
4. Build command: `npm run build`
5. Output directory: `client/dist`
6. Deploy.

### Notes

- React Router deep links are handled via rewrite rules in both configs.
- No runtime environment variables are currently required for production.

## Project Map

`client/src/main.jsx` - App bootstrap and router mounting  
`client/src/App.jsx` - Routes + shared layout (navbar/footer)  
`client/src/pages/` - All page content (Home, Services, Legal, etc.)  
`client/src/ui.jsx` - Shared UI components and theme context  
`client/src/data.js` - Services list, treatment content, constants  
`client/src/styles.css` - Tailwind + custom styles  
`client/public/` - Images, video, and icons
