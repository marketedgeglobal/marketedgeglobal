export type ChatMessage = { role: "user" | "assistant"; content: string };

type AgentEndpoint = "assistant" | "upload";

function getConfiguredAgentUrl(): string | null {
	const envUrl = import.meta.env.VITE_AGENT_API_URL as string | undefined;
	if (envUrl && envUrl.trim()) return envUrl.trim();
	const runtimeUrl = (window as any).__AGENT_API_URL as string | undefined;
	if (runtimeUrl && runtimeUrl.trim()) return runtimeUrl.trim();
	return null;
}

export function resolveAgentUrl(endpoint: AgentEndpoint): string {
	const configured = getConfiguredAgentUrl();

	if (configured) {
		const url = new URL(configured, window.location.origin);
		const normalizedPath = url.pathname.replace(/\/+$/, "");
		const endpointMatch = normalizedPath.match(/^(.*)\/(agent|assistant|upload|assistants)$/);

		if (endpoint === "assistant" && endpointMatch) {
			const configuredEndpoint = endpointMatch[2];
			if (configuredEndpoint === "agent" || configuredEndpoint === "assistant") {
				url.pathname = normalizedPath;
				url.search = "";
				url.hash = "";
				return url.toString();
			}
		}

		if (endpointMatch) {
			const prefix = endpointMatch[1] || "";
			url.pathname = `${prefix}/${endpoint}`.replace(/\/+/g, "/");
		} else {
			url.pathname = `${normalizedPath}/${endpoint}`.replace(/\/+/g, "/");
		}

		url.search = "";
		url.hash = "";
		return url.toString();
	}

	if (import.meta.env.BASE_URL && import.meta.env.BASE_URL !== "/") {
		return new URL(endpoint, window.location.origin + import.meta.env.BASE_URL).toString();
	}

	return `/${endpoint}`;
}

function isLikelyFetchNetworkError(err: Error): boolean {
	const message = err.message.toLowerCase();
	return err.name === "TypeError" && (message.includes("failed to fetch") || message.includes("fetch failed") || message.includes("networkerror"));
}

function formatFetchFailureMessage(url: string, operation: "assistant" | "upload"): string {
	const pageProtocol = window.location.protocol;
	const targetProtocol = new URL(url, window.location.origin).protocol;
	const mixedContentHint = pageProtocol === "https:" && targetProtocol === "http:"
		? " Mixed content is blocked: use an HTTPS backend URL for VITE_AGENT_API_URL."
		: "";
	const operationLabel = operation === "upload" ? "File upload" : "Assistant request";
	return `${operationLabel} could not reach backend endpoint: ${url}. This is usually a CORS, DNS, backend availability, or TLS issue.${mixedContentHint}`;
}

// The client should call the server-side proxy to keep the OpenAI API key secret.
async function sendMessage(messages: ChatMessage[], assistantId: string, attachments?: { id: string; name: string }[]): Promise<string> {
	const url = resolveAgentUrl("assistant");

	try {
		const resp = await fetch(url, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ assistant_id: assistantId, messages: messages, attachments: attachments ?? [] }),
			signal: AbortSignal.timeout(45000), // 45 second timeout
		});

		if (!resp.ok) {
			const text = await resp.text();
			throw new Error(`Proxy request failed: ${text}`);
		}

		const data = await resp.json();
		return data.reply ?? "";
	} catch (err) {
		// Provide more helpful error messages
		if (err instanceof Error) {
			if (isLikelyFetchNetworkError(err)) {
				throw new Error(formatFetchFailureMessage(url, "assistant"));
			}
			if (err.name === 'AbortError') {
				throw new Error('Request timed out. The server took too long to respond.');
			}
			throw err;
		}
		throw new Error(`Failed to fetch: ${String(err)}`);
	}
}

export { sendMessage };

