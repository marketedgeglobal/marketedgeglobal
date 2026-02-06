export type ChatMessage = { role: "user" | "assistant"; content: string };

// The client should call the server-side proxy to keep the OpenAI API key secret.
async function sendMessage(message: string, assistantId: string): Promise<string> {
	// Use Vite base URL so requests work when the app is served under a subpath
	const base = import.meta.env.BASE_URL ?? "/";
	const url = `${base}assistant`;
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

