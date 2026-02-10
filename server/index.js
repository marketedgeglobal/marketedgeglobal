import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import path from "path";

dotenv.config();

const app = express();
const port = parseInt(process.env.PORT || "", 10) || 8787;

const allowedOrigin = process.env.ALLOWED_ORIGIN || "*";

app.use(
  cors({
    origin: allowedOrigin,
  })
);
app.use(express.json({ limit: "1mb" }));

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), "server", "uploads");
try {
  fs.mkdirSync(uploadsDir, { recursive: true });
} catch (e) {
  // ignore
}

const upload = multer({ dest: uploadsDir, limits: { fileSize: 5 * 1024 * 1024 } });

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

// File upload endpoint (MVP: accepts text-like files and stores them)
app.post("/upload", upload.array("files"), (req, res) => {
  const files = req.files || [];
  const saved = files.map((f) => ({ id: f.filename || f.filename, name: f.originalname, mime: f.mimetype, size: f.size }));
  return res.json({ files: saved });
});

// Proxy for Assistants API (keeps OPENAI_API_KEY on server)
// Accept requests at `/assistant` or `/<base>/assistant` (useful when the
// frontend is served under a subpath like `/marketedgeglobal/`).
// Handler for assistant proxy; register both an explicit '/assistant' route
// and the prefixed regex route so requests match reliably.
async function assistantProxyHandler(request, response) {
  console.log("Assistant proxy received request", { path: request.path, origin: request.get("origin") });
  const { assistant_id, messages } = request.body ?? {};

  if (!assistant_id) {
    return response.status(400).json({ error: "assistant_id is required" });
  }

  if (!Array.isArray(messages)) {
    return response.status(400).json({ error: "messages must be an array" });
  }

  if (!process.env.OPENAI_API_KEY) {
    return response.status(500).json({ error: "OPENAI_API_KEY is not configured" });
  }

  try {
    console.log("Assistant proxy body", { assistant_id, messages_length: Array.isArray(messages) ? messages.length : 0 });
    
    // Create a thread for this conversation
    const threadRes = await fetch('https://api.openai.com/v1/threads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'OpenAI-Beta': 'assistants=v2',
      },
      body: JSON.stringify({}),
    });

    if (!threadRes.ok) {
      const errorText = await threadRes.text();
      console.error('Failed to create thread:', errorText);
      return response.status(threadRes.status).json({ error: 'Failed to create thread', details: errorText });
    }

    const threadData = await threadRes.json();
    const threadId = threadData.id;
    console.log('Created thread:', { threadId, assistant_id });

    // Upload attachments to OpenAI Files API and add them to the thread
    const attachments = request.body?.attachments || [];
    const uploadedFileIds = [];
    
    for (const a of attachments) {
      try {
        const filePath = path.join(uploadsDir, a.id);
        if (fs.existsSync(filePath)) {
          // Read the file and create FormData for the Files API
          const fileBuffer = fs.readFileSync(filePath);
          const fileName = a.name || `file-${a.id}`;
          
          // Create FormData to upload to OpenAI
          const formData = new FormData();
          const blob = new Blob([fileBuffer], { type: a.mime || 'application/octet-stream' });
          formData.append('file', blob, fileName);
          formData.append('purpose', 'assistants');
          
          const uploadRes = await fetch('https://api.openai.com/v1/files', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            body: formData,
          });
          
          if (uploadRes.ok) {
            const fileData = await uploadRes.json();
            uploadedFileIds.push(fileData.id);
            console.log('Uploaded file to OpenAI:', { fileName, openaiFileId: fileData.id });
          } else {
            const errorText = await uploadRes.text();
            console.warn('Failed to upload file to OpenAI:', { fileName, status: uploadRes.status, error: errorText });
          }
        }
      } catch (e) {
        console.warn('Failed to process attachment', a.name, e?.message || e);
      }
    }

    // Add all messages to the thread for proper context
    // This ensures the assistant has conversation history
    for (let msgIdx = 0; msgIdx < messages.length; msgIdx++) {
      const msg = messages[msgIdx];
      const content = typeof msg === 'string' ? msg : msg.content;
      const role = typeof msg === 'string' ? 'user' : msg.role;
      const isLastMessage = msgIdx === messages.length - 1;
      
      // Prepare the message body
      const messageBody = {
        role: role,
        content: content,
      };
      
      // Add file attachments to the last user message only
      if (isLastMessage && role === 'user' && uploadedFileIds.length > 0) {
        messageBody.attachments = uploadedFileIds.map((fileId) => ({
          file_id: fileId,
          tools: [{ type: 'file_search' }],
        }));
        console.log('Added file attachments to last user message:', { count: uploadedFileIds.length, fileIds: uploadedFileIds });
      }
      
      const msgRes = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'OpenAI-Beta': 'assistants=v2',
        },
        body: JSON.stringify(messageBody),
      });

      if (!msgRes.ok) {
        const errorText = await msgRes.text();
        console.error('Failed to add message to thread:', errorText);
        return response.status(msgRes.status).json({ error: 'Failed to add message', details: errorText });
      }
    }

    console.log('Added', messages.length, 'messages to thread:', { threadId });

    // Run the assistant on the thread
    const runRes = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'OpenAI-Beta': 'assistants=v2',
      },
      body: JSON.stringify({
        assistant_id: assistant_id,
      }),
    });

    if (!runRes.ok) {
      const errorText = await runRes.text();
      console.error('Failed to run assistant:', errorText);
      return response.status(runRes.status).json({ error: 'Failed to run assistant', details: errorText });
    }

    const runData = await runRes.json();
    const runId = runData.id;
    console.log('Started assistant run:', { runId, threadId });

    // Poll for completion (with timeout)
    let runStatus = runData.status;
    let attempts = 0;
    const maxAttempts = 100; // 30 seconds with 300ms polls

    while (runStatus === 'queued' || runStatus === 'in_progress') {
      if (attempts >= maxAttempts) {
        console.warn('Assistant run timed out:', { runId, threadId });
        return response.status(504).json({ error: 'Assistant response timed out' });
      }

      await new Promise((resolve) => setTimeout(resolve, 300));

      const checkRes = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs/${runId}`, {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'OpenAI-Beta': 'assistants=v2',
        },
      });

      if (checkRes.ok) {
        const checkData = await checkRes.json();
        runStatus = checkData.status;
        console.log('Run status:', { runId, status: runStatus });
      }

      attempts++;
    }

    if (runStatus !== 'completed') {
      console.error('Assistant run failed:', { runId, status: runStatus });
      return response.status(500).json({ error: `Assistant run failed with status: ${runStatus}` });
    }

    // Retrieve the assistant's response from the thread
    const messagesRes = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'OpenAI-Beta': 'assistants=v2',
      },
    });

    if (!messagesRes.ok) {
      const errorText = await messagesRes.text();
      console.error('Failed to retrieve messages:', errorText);
      return response.status(messagesRes.status).json({ error: 'Failed to retrieve response', details: errorText });
    }

    const messagesData = await messagesRes.json();
    // Find the most recent assistant message
    const assistantMessage = messagesData.data?.find((m) => m.role === 'assistant');
    const reply = assistantMessage?.content?.[0]?.text?.value || 'Sorry, I couldn\'t generate a reply.';

    console.log('Retrieved assistant response:', { threadId, reply: reply.substring(0, 100) });

    return response.json({ reply });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected error";
    console.error('Assistant proxy error:', message);
    return response.status(500).json({ error: message });
  }
}

app.post('/assistant', assistantProxyHandler);
app.post(/^(.+\/)?assistant$/, assistantProxyHandler);

// List assistants (server-side) so the frontend can discover assistants
// without baking IDs into the client build.
const assistantsHandler = async (request, response) => {
  if (!process.env.OPENAI_API_KEY) {
    return response.status(500).json({ error: "OPENAI_API_KEY is not configured" });
  }

  try {
    const r = await fetch("https://api.openai.com/v1/assistants", {
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
    });

    if (!r.ok) {
      const text = await r.text();
      return response.status(r.status).json({ error: text });
    }

    const data = await r.json();
    const assistants = (data.data || []).map((a) => ({
      id: a.id,
      name: a.name || (a.metadata && a.metadata.title) || "Assistant",
      description: a.metadata?.description || "",
    }));

    return response.json({ assistants });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected error";
    return response.status(500).json({ error: message });
  }
};

app.get('/assistants', assistantsHandler);
app.get(/^(.+\/)?assistants$/, assistantsHandler);

const host = process.env.HOST || '0.0.0.0';
const server = app.listen(port, host, () => {
  const addr = server.address();
  const bound = typeof addr === 'string' ? addr : `${host}:${port}`;
  console.log(`Agent proxy listening on http://${bound} (env PORT=${process.env.PORT})`);
});
