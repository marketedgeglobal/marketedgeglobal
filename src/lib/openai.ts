export type ChatMessage = { role: "user" | "assistant"; content: string };

// The client should call the server-side proxy to keep the OpenAI API key secret.
async function sendMessage(message: string, assistantId: string): Promise<string> {
	// Prefer an explicitly configured backend (`VITE_AGENT_API_URL`) so the client
	// calls the real server (useful in dev where the backend runs on another port).
	const agentApi = import.meta.env.VITE_AGENT_API_URL as string | undefined;
	let url: string;
	if (agentApi) {
		url = new URL('assistant', agentApi).toString();
	} else if (import.meta.env.BASE_URL && import.meta.env.BASE_URL !== '/') {
		url = new URL('assistant', window.location.origin + (import.meta.env.BASE_URL ?? '/')).toString();
	} else {
		// Default to same-origin root path
		url = '/assistant';
	}

	const resp = await fetch(url, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ assistant_id: assistantId, messages: [ { role: "user", content: message } ] }),
	});

	if (!resp.ok) {
		const text = await resp.text();
		throw new Error(`Proxy request failed: ${text}`);
	}

	const data = await resp.json();
	return data.reply ?? "";
}

export { sendMessage };

