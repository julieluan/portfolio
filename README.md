# Portfolio + Cloudflare Worker

This project uses Vite for the React front end and a Cloudflare Worker for lightweight API routes that can run close to users.

## Local development

Run the UI and the worker side by side:

1. `npm install`
2. `npm run dev:worker` – starts the worker on `http://127.0.0.1:8787`
3. In another terminal `npm run dev` – Vite proxies any request to `/api/worker/*` to the worker dev server

## Deploying

- `npm run build` – builds the static site into `dist/`
- `npm run deploy:worker` – publishes the worker defined in `wrangler.json`

Set `VITE_WORKER_BASE_URL` before building if the worker lives on a different origin (for example `https://portfolio-worker.yourname.workers.dev`). When this variable is absent the UI will call relative paths so it can sit behind the same domain as the worker or rely on the local dev proxy.
