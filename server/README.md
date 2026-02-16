# Agent Proxy Server

This lightweight server proxies your web chat to the OpenAI API so your API key stays private.

## Setup

1. Copy environment file:

   - Duplicate .env.example as .env

2. Install dependencies:

   - npm install

3. Start the server:

   - npm run dev

The server listens on http://localhost:8787 and exposes:

- GET /health
- POST /agent

## Optional hardening env vars

- ALLOWED_ORIGIN (comma-separated allowlist)
- REQUEST_TIMEOUT_MS (default 20000)
- RATE_LIMIT_WINDOW_MS (default 60000)
- RATE_LIMIT_MAX (default 60)
- MAX_UPLOAD_FILES (default 5)
- MAX_UPLOAD_SIZE (default 2097152 bytes)

## Request shape

POST /agent

{
  "messages": [
    { "role": "user", "content": "Hello" }
  ]
}

## Response shape

{
  "reply": "Hi there!" 
}

## Deployment

Deploy this folder to a Node hosting provider (Render, Railway, Fly.io, AWS, etc.).
Set the deployed URL as VITE_AGENT_API_URL in your site build.
