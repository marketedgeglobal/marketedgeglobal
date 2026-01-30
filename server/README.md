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
