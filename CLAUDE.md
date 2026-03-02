# CLAUDE.md — colorstrike-support

## What This Is
- ColorStrike support & marketing website
- Tech: static HTML + Vercel serverless API functions (free Hobby plan)
- Pages: `index.html` (main), `privacy.html`, `updates.html`
- API: `api/` folder — serverless functions for feedback form

## Deploy
```bash
cd ~/Desktop/colorstrike-support
npx vercel --prod
```
**NO git push needed.** Vercel CLI deploys directly from local files.

## Key URLs
- Live site: https://colorstrike-support.vercel.app
- TestFlight: https://testflight.apple.com/join/sqFFH8gq

## Feedback Pipeline
In-game form (FeedbackView.swift) → POST to `api/` → Telegram bot → Ariel

## Workflow Rules
- **Always deploy after making changes** — run `npx vercel --prod` automatically, never ask "want me to deploy?"
- User can't verify changes without deploying, so just deploy every time

## Safety Rules
- **NEVER `rm` or `rm -rf`** — use `trash` command instead
- **NEVER `git checkout -- .` or any git revert/reset** — destroys work

## Notes
- `shared.css` has nav, footer, body, scrollbar, and reveal styles shared across all pages
- Page-specific styles are inline in each HTML file
- `vercel.json` handles routing config
- `.vercel/` folder has project config — don't delete
