# Agent Backend Setup

GitHub Pages is static, so the chat widget calls a separate backend proxy.

## 1) Deploy the proxy

Use the server template in server/:

- server/index.js
- server/package.json

Deploy this folder to your Node host (Render, Railway, Fly.io, AWS, etc.).
Set the following environment variables on the host:

- OPENAI_API_KEY
- OPENAI_MODEL (optional, default gpt-4.1-mini)
- ALLOWED_ORIGIN (optional, set to your site URL)

The API endpoint should be:

- POST /agent

### Fly.io (GitHub Actions)

This repo includes a GitHub Actions workflow to deploy the proxy to Fly.io.

1. Create a Fly.io app and copy its name.
2. Add GitHub Actions secrets:

	- FLY_API_TOKEN
	- FLY_APP_NAME
	- VITE_AGENT_API_URL (your deployed https://<app>.fly.dev/agent)

3. Set your runtime secrets on Fly.io:

	- OPENAI_API_KEY
	- OPENAI_MODEL (optional)
	- ALLOWED_ORIGIN (optional, e.g. https://rmallorybpc.github.io)

On push to main (or manual dispatch), the workflow in .github/workflows/deploy-agent.yml will deploy the proxy.

## 2) Configure GitHub Pages build

Set a GitHub Actions secret named VITE_AGENT_API_URL and set it to your deployed backend URL, e.g.

https://api.yourdomain.com/agent

The deploy workflow will inject this into the build so the site can call your backend.

## 3) Test locally

- Start the proxy from server/
- In the web app, set VITE_AGENT_API_URL for local dev (e.g. in a .env.local file)

VITE_AGENT_API_URL=http://localhost:8787/agent
