import dotenv from "dotenv";
import express from "express";
import cors from "cors";

dotenv.config();

const app = express();
const port = process.env.PORT || 8787;

const allowedOrigin = process.env.ALLOWED_ORIGIN || "*";

app.use(
  cors({
    origin: allowedOrigin,
  })
);
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_request, response) => {
  response.json({ status: "ok" });
});

app.post("/agent", async (request, response) => {
  const { messages } = request.body ?? {};

  if (!Array.isArray(messages)) {
    return response.status(400).json({ error: "messages must be an array" });
  }

  if (!process.env.OPENAI_API_KEY) {
    return response.status(500).json({ error: "OPENAI_API_KEY is not configured" });
  }

  try {
    const payload = {
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      input: messages,
      temperature: 0.3,
    };

    const apiResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      return response.status(apiResponse.status).json({ error: errorText });
    }

    const data = await apiResponse.json();
    const outputText =
      data.output_text ??
      (data.output || [])
        .flatMap((item) => item.content || [])
        .filter((content) => content.type === "output_text")
        .map((content) => content.text)
        .join("\n");

    return response.json({ reply: outputText || "Sorry, I couldn’t generate a reply." });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return response.status(500).json({ error: message });
  }
});

app.listen(port, () => {
  console.log(`Agent proxy listening on http://localhost:${port}`);
});
