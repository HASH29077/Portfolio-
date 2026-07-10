# Hash Portfolio

## Run locally
```
npm install
npm run dev
```

## Deploy to GitHub Pages

1. Push this whole folder to a GitHub repo (e.g. `hash-portfolio`).
2. In `vite.config.js`, set `base` to `/your-repo-name/` (already set to `/hash-portfolio/` — change it if your repo name is different).
3. In your repo: Settings → Pages → Source → set to **GitHub Actions**.
4. Push to `main`. The workflow in `.github/workflows/deploy.yml` builds and deploys automatically.
5. Your site will be live at `https://<your-username>.github.io/<repo-name>/`.

## Deploy manually instead (no Actions)
```
npm run build
npm run deploy
```
This uses `gh-pages` to push the `dist` folder to a `gh-pages` branch. Enable Pages on that branch in repo settings if you go this route.
