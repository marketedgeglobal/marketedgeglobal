import { useEffect, useRef, useState, type ReactNode } from "react";
import { sendMessage, type ChatMessage } from "../lib/openai";

type PageProps = {};

interface AttachedFile {
  name: string;
  size: number;
  file?: File;
}

export function GetStartedPage(_: PageProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const defaultFinancialId = import.meta.env.VITE_OPENAI_FINANCIAL_ASSISTANT_ID ?? 'asst_2BNcG5OJXbPfhDmCadhC7aGM';
  const [currentAssistantId, setCurrentAssistantId] = useState<string | null>(
    import.meta.env.VITE_OPENAI_ASSISTANT_ID ?? defaultFinancialId
  );
  const [currentAssistantName, setCurrentAssistantName] = useState<string>(
    ""
  );
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const initialMessageCountRef = useRef(0); // Track how many initial greeting messages were added
  const inputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isChatOpen) return;
    inputRef.current?.focus();
  }, [isChatOpen]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isChatOpen]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles: AttachedFile[] = Array.from(files).map((file) => ({
        name: file.name,
        size: file.size,
        file,
      }));
      setAttachedFiles((prev) => [...prev, ...newFiles]);
    }
    // Reset input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSend = async () => {
    if (!inputValue.trim() || isSending) {
      return;
    }
    const messageText = inputValue.trim();

    const userMessage: ChatMessage = { role: "user", content: messageText };
    // Append the user's message first (don't show "Thinking..." while uploading files)
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setErrorMessage(null);
    setIsSending(true);

    // Upload files if present
    let uploaded: { id: string; name: string }[] = [];
    if (attachedFiles.length > 0) {
      try {
        const agentApi = import.meta.env.VITE_AGENT_API_URL as string | undefined;
        let uploadUrl: string;
        if (agentApi) {
          uploadUrl = new URL('upload', agentApi).toString();
        } else if (import.meta.env.BASE_URL && import.meta.env.BASE_URL !== '/') {
          uploadUrl = new URL('upload', window.location.origin + (import.meta.env.BASE_URL ?? '/')).toString();
        } else {
          uploadUrl = '/upload';
        }

        const form = new FormData();
        attachedFiles.forEach((f) => {
          if (f.file) form.append('files', f.file);
        });

        const upResp = await fetch(uploadUrl, { method: 'POST', body: form });
        if (!upResp.ok) {
          const txt = await upResp.text();
          throw new Error(`Upload failed: ${txt}`);
        }
        const upData = await upResp.json();
        uploaded = upData.files || [];
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Upload failed';
        setErrorMessage(message);
        setIsSending(false);
        return;
      }
    }

    // Show thinking placeholder while waiting for assistant response
    const placeholderText = 'Thinking...';
    const assistantPlaceholder: ChatMessage = { role: 'assistant', content: placeholderText };
    setMessages((prev) => [...prev, assistantPlaceholder]);

    try {
      if (!currentAssistantId) throw new Error('No assistant selected');

      // Send the full conversation history (excluding the "Thinking..." placeholder and initial greeting messages)
      // Initial greeting messages are for UI display only and should not be sent to the Assistants API
      // IMPORTANT: Use the userMessage directly since React state updates are async and `messages` is stale
      const conversationHistory = messages
        .slice(initialMessageCountRef.current) // Skip initial greeting messages
        .filter((m) => m.content !== placeholderText); // Skip thinking placeholder
      conversationHistory.push(userMessage); // Add the user's current message
      const reply = await sendMessage(conversationHistory, currentAssistantId, uploaded.length ? uploaded : undefined);

      setMessages((prev) => {
        const copy = [...prev];
        const lastIdx = copy.map((m) => m.content).lastIndexOf(placeholderText);
        if (lastIdx !== -1) {
          copy[lastIdx] = { role: 'assistant', content: reply };
          return copy;
        }
        return [...prev, { role: 'assistant', content: reply }];
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error';
      setErrorMessage(message);
      // Remove placeholder
      setMessages((prev) => prev.filter((m) => m.content !== placeholderText));
    } finally {
      setAttachedFiles([]);
      setIsSending(false);
    }
  };

  

  const openAssistant = (id: string | null, name: string) => {
    const financialId = import.meta.env.VITE_OPENAI_FINANCIAL_ASSISTANT_ID ?? 'asst_2BNcG5OJXbPfhDmCadhC7aGM';
    const operationsId = import.meta.env.VITE_OPENAI_OPERATIONS_ASSISTANT_ID ?? 'asst_pGMkUNldDi6EXOQKvpM26Gtb';
    const bdId = import.meta.env.VITE_OPENAI_BD_ASSISTANT_ID ?? 'asst_yzDWzTYPE7bJf4vbqQlklmiP';
    const marketingId = import.meta.env.VITE_OPENAI_MARKETING_ASSISTANT_ID ?? 'asst_8XjZDwU3nU8PzDcqcOHqK2KU';
    const ramiroId = import.meta.env.VITE_OPENAI_RAMIRO_ASSISTANT_ID ?? 'asst_LwQ63jo5RMN3WTwMeSnTRbun';
    const sarahId = 'asst_9KTRSFnH5aFCZtAmWNaeRLVZ';

    // Resolve a null id to the expected assistant id based on name, ensuring
    // we always have an assistant_id when sending messages.
    const resolvedId = id ?? (name === 'Financial Management Help' ? financialId : name === 'Operations Systems' || name === 'Operations Systems Support' ? operationsId : name === 'Business Development Support' || name === 'Business Development Assistant' ? bdId : name === 'Marketing and Communications' ? marketingId : name === 'Sarah Whitmore- Senior Programme Manager at FCDO' || name === 'Sarah Whitmore - Senior Programme Manager at FCDO' ? sarahId : null);
    setCurrentAssistantId(resolvedId);
    setCurrentAssistantName(name);
    // Set initial messages per assistant so previews match the selected agent
    let initialMessages: ChatMessage[] = [];
    if (name === "Financial Management Help" || id === financialId) {
      initialMessages = [
        {
          role: "assistant",
          content:
            "Hello — I'm here to help with financial management, budgeting, and reporting. Ask about forecasts, cashflow, expense categorization, or attach financial documents for review.",
        },
      ];
    } else if (name === "Operations Systems" || name === "Operations Systems Support" || id === operationsId) {
      initialMessages = [
        {
          role: "assistant",
          content:
            "Hi — I'm the Operations Systems assistant. I can help with system architecture, deployments, monitoring, integrations, runbooks, and automations. Attach diagrams, configs, or logs and I'll review them.",
        },
      ];
    } else if (name === "Business Development Support" || name === "Business Development Assistant" || id === bdId) {
      initialMessages = [
        {
          role: "assistant",
          content:
            "Hello — I'm the Business Development Support assistant. I can help with partnership outreach, proposal framing, market research, and engagement strategies. Attach briefs or partner info and I'll provide recommendations.",
        },
      ];
    } else if (name === "Marketing and Communications" || id === marketingId) {
      initialMessages = [
        {
          role: "assistant",
          content:
            "Hello — I'm the Marketing and Communications assistant. I can help with strategy development, messaging, campaign planning, stakeholder communication, and brand positioning. Attach briefs, messaging documents, or communication plans for feedback.",
        },
      ];
    } else if (name === "Ramiro - The Bolivian Rancher" || id === ramiroId) {
      initialMessages = [
        {
          role: "assistant",
          content:
            "Hola — I'm Ramiro, The Bolivian Rancher. I can help with smallholder livestock management, pasture rotation, local market pricing, and practical farm accounting. Ask about animal health, feed planning, or simple budgeting for your ranch operations.",
        },
      ];
    } else if (name === "Sarah Whitmore- Senior Programme Manager at FCDO" || id === sarahId) {
      initialMessages = [
        {
          role: "assistant",
          content:
            "Hello — I'm Sarah Whitmore, Senior Programme Manager at FCDO. I can help you prepare for stakeholder engagement, clarify program priorities, and anticipate donor expectations. Ask about risk management, value-for-money, results frameworks, or partnership alignment.",
        },
      ];
    }
    initialMessageCountRef.current = initialMessages.length;
    setMessages(initialMessages);
    setIsChatOpen(true);
  };

  const formatMessageContent = (content: string): ReactNode => {
    if (!content) return null;
    const lines = content.replace(/\r\n/g, "\n").split("\n");
    const nodes: ReactNode[] = [];
    let i = 0;
    let keyIndex = 0;

    while (i < lines.length) {
      // skip leading blank lines
      if (lines[i].trim() === "") {
        i++;
        continue;
      }

      // unordered list (lines starting with - or *)
      if (/^\s*([-*])\s+/.test(lines[i])) {
        const items: string[] = [];
        while (i < lines.length && /^\s*([-*])\s+/.test(lines[i])) {
          items.push(lines[i].replace(/^\s*([-*])\s+/, ""));
          i++;
        }
        nodes.push(
          <ul key={`ul-${keyIndex++}`} className="mt-2 list-disc list-inside space-y-2">
            {items.map((it, idx) => (
              <li key={idx}>{it}</li>
            ))}
          </ul>
        );
        continue;
      }

      // ordered list (lines starting with 1. 2. etc.)
      if (/^\s*\d+\.\s+/.test(lines[i])) {
        const items: string[] = [];
        while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
          items.push(lines[i].replace(/^\s*\d+\.\s+/, ""));
          i++;
        }
        nodes.push(
          <ol key={`ol-${keyIndex++}`} className="mt-2 list-decimal list-inside space-y-2">
            {items.map((it, idx) => (
              <li key={idx}>{it}</li>
            ))}
          </ol>
        );
        continue;
      }

      // paragraph (one or more lines until a blank or a list)
      const paraLines: string[] = [];
      while (i < lines.length && lines[i].trim() !== "" && !/^\s*([-*]|\d+\.)\s+/.test(lines[i])) {
        paraLines.push(lines[i]);
        i++;
      }

      const children: ReactNode[] = [];
      paraLines.forEach((pl, idx) => {
        if (idx > 0) children.push(<br key={`br-${idx}`} />);
        children.push(pl);
      });

      nodes.push(
        <p key={`p-${keyIndex++}`} className="text-sm mt-2">
          {children}
        </p>
      );
    }

    return nodes;
  };

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">PartnerAI™</p>
          <h1 className="mt-1 text-4xl font-semibold leading-tight md:text-5xl">
            Democratizing AI for Social Impact.
          </h1>
          <div className="mt-3 max-w-3xl text-slate-300">
            <p className="text-lg">PartnerAI embeds AI directly into:</p>
            <ul className="mt-2 list-disc list-inside space-y-1 text-lg">
              <li>Delivery workflows</li>
              <li>Portfolio management</li>
              <li>Reporting and compliance</li>
              <li>Decision-making processes</li>
            </ul>
            <p className="mt-2 text-base text-slate-300">
              All within a secure, role-based dashboard tailored to mission-driven organizations.
            </p>
          </div>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div>
              <button
                type="button"
                className="rounded-full bg-indigo-500 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-400 transition-colors"
              >
                Request a Live Demo from Our Team
              </button>
              <p className="mt-2 text-xs text-slate-400">See how PartnerAI applies to your specific workflow.</p>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-semibold text-slate-100">Explore How PartnerAI Supports Your Work</h2>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-slate-800/60 bg-slate-900/60 p-6 flex flex-col h-full transition hover:-translate-y-0.5 hover:shadow-lg">
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800/70 text-indigo-200">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M4 19h16" />
                    <path d="M6 16V8" />
                    <path d="M12 16V5" />
                    <path d="M18 16v-6" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold">Advanced Analytics</h3>
              </div>
              <p className="text-sm text-slate-400">
                Turn documents and live data into structured insights and visual dashboards.
              </p>
              <div className="mt-2 flex flex-wrap gap-3">
                <a
                  href="https://marketedgeglobal.github.io/marketedgeglobal/explore-platform/ranking-tool/"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Score and compare partners, sectors, or proposals using weighted criteria."
                  aria-label="Score and compare partners, sectors, or proposals using weighted criteria."
                  className="rounded-full bg-indigo-500 px-4 py-2 text-sm font-semibold hover:bg-indigo-400 transition-colors"
                >
                  Ranking Tool
                </a>
                <button
                  type="button"
                  onClick={() => openAssistant('asst_5NTh5OINlU3NoN0ROHFOXrrp', 'Publication Review')}
                  title="Summarize long reports and extract key findings, themes, and recommendations."
                  aria-label="Summarize long reports and extract key findings, themes, and recommendations."
                  className="rounded-full bg-indigo-500 px-4 py-2 text-sm font-semibold hover:bg-indigo-400 transition-colors"
                >
                  Publication Review
                </button>
                <a
                  href="https://marketedgeglobal.github.io/marketintelligence/"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Scan sectors and markets. Identify trends, risks, and opportunity signals."
                  aria-label="Scan sectors and markets. Identify trends, risks, and opportunity signals."
                  className="rounded-full bg-indigo-500 px-4 py-2 text-sm font-semibold hover:bg-indigo-400 transition-colors"
                >
                  Market Intelligence
                </a>
                <a
                  href="https://marketedgeglobal.github.io/rfpintelligence/"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Extract requirements, deadlines, and compliance gaps from funding calls."
                  aria-label="Extract requirements, deadlines, and compliance gaps from funding calls."
                  className="rounded-full bg-indigo-500 px-4 py-2 text-sm font-semibold hover:bg-indigo-400 transition-colors"
                >
                  RFP Intelligence
                </a>
                <a
                  href="https://marketedgeglobal.github.io/BASIN/"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Example structured market assessment. Replace with your own country or sector."
                  aria-label="Example structured market assessment. Replace with your own country or sector."
                  className="rounded-full bg-indigo-500 px-4 py-2 text-sm font-semibold hover:bg-indigo-400 transition-colors"
                >
                  Market Assessment (Sample: Mekong)
                </a>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-slate-800/60 bg-slate-900/60 p-6 flex flex-col h-full transition hover:-translate-y-0.5 hover:shadow-lg">
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800/70 text-indigo-200">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M12 3v4" />
                    <path d="M8 7h8" />
                    <path d="M6 11h12" />
                    <path d="M6 15h8" />
                    <path d="M6 19h6" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold">On-the-Job AI Assistants</h3>
              </div>
              <p className="text-sm text-slate-400">
                AI-powered task companions embedded into real workflows.
              </p>
              <div className="mt-2 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => openAssistant(import.meta.env.VITE_OPENAI_FINANCIAL_ASSISTANT_ID ?? 'asst_2BNcG5OJXbPfhDmCadhC7aGM', 'Financial Management Help')}
                  title="Draft budgets, reconcile reports, and flag compliance gaps."
                  aria-label="Draft budgets, reconcile reports, and flag compliance gaps."
                  className="rounded-full bg-indigo-500 px-4 py-2 text-sm font-semibold hover:bg-indigo-400 transition-colors"
                >
                  Financial Management Help
                </button>
                <button
                  type="button"
                  onClick={() => openAssistant(import.meta.env.VITE_OPENAI_OPERATIONS_ASSISTANT_ID ?? 'asst_pGMkUNldDi6EXOQKvpM26Gtb', 'Operations Systems Support')}
                  title="Improve SOPs, process maps, internal workflows, and coordination systems."
                  aria-label="Improve SOPs, process maps, internal workflows, and coordination systems."
                  className="rounded-full bg-indigo-500 px-4 py-2 text-sm font-semibold hover:bg-indigo-400 transition-colors"
                >
                  Operations Systems Support
                </button>
                <button
                  type="button"
                  onClick={() => openAssistant(import.meta.env.VITE_OPENAI_BD_ASSISTANT_ID ?? 'asst_yzDWzTYPE7bJf4vbqQlklmiP', 'Business Development Assistant')}
                  title="Draft proposal sections, check RFP alignment, and analyze partner fit."
                  aria-label="Draft proposal sections, check RFP alignment, and analyze partner fit."
                  className="rounded-full bg-indigo-500 px-4 py-2 text-sm font-semibold hover:bg-indigo-400 transition-colors"
                >
                  Business Development Assistant
                </button>
                <button
                  type="button"
                  onClick={() => openAssistant(import.meta.env.VITE_OPENAI_MARKETING_ASSISTANT_ID ?? 'asst_8XjZDwU3nU8PzDcqcOHqK2KU', 'Marketing & Communications Assistant')}
                  title="Generate donor updates, messaging drafts, and strategic communications."
                  aria-label="Generate donor updates, messaging drafts, and strategic communications."
                  className="rounded-full bg-indigo-500 px-4 py-2 text-sm font-semibold hover:bg-indigo-400 transition-colors"
                >
                  Marketing & Communications Assistant
                </button>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-slate-800/60 bg-slate-900/60 p-6 flex flex-col h-full transition hover:-translate-y-0.5 hover:shadow-lg">
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800/70 text-indigo-200">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <circle cx="8" cy="9" r="3" />
                    <circle cx="17" cy="8" r="2.5" />
                    <path d="M3.5 19c1.5-2.5 4-4 6.5-4" />
                    <path d="M14 19c.8-1.6 2.3-2.6 4.5-2.8" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold">Stakeholder Personas & Simulation</h3>
              </div>
              <p className="text-sm text-slate-400">
                Engage AI-powered stakeholder personas for training and strategy testing.
              </p>
              <div className="mt-2 grid gap-3">
                <button
                  type="button"
                  onClick={() => openAssistant(import.meta.env.VITE_OPENAI_RAMIRO_ASSISTANT_ID ?? 'asst_LwQ63jo5RMN3WTwMeSnTRbun', 'Ramiro - The Bolivian Rancher')}
                  title="Practice stakeholder conversations and test messaging in a safe simulation."
                  aria-label="Practice stakeholder conversations and test messaging in a safe simulation."
                  className="flex w-full items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-left transition hover:border-indigo-400 hover:bg-slate-900"
                >
                  <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white text-xs">RA</div>
                  <div className="text-sm text-slate-200">Ramiro - The Bolivian Rancher</div>
                </button>
                <button
                  type="button"
                  onClick={() => openAssistant('asst_Efsxetzg8NyymK7AIit4knip', 'Jannatul - Bangladeshi University Student')}
                  title="Practice stakeholder conversations and test messaging in a safe simulation."
                  aria-label="Practice stakeholder conversations and test messaging in a safe simulation."
                  className="flex w-full items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-left transition hover:border-indigo-400 hover:bg-slate-900"
                >
                  <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white text-xs">JU</div>
                  <div className="text-sm text-slate-200">Jannatul - Bangladeshi University Student</div>
                </button>
                <button
                  type="button"
                  onClick={() => openAssistant('asst_zHLROcxpPw6Ho1AOlZh3Sv7N', 'Niar Tun - Agribusiness Exporter from Myanmar')}
                  title="Practice stakeholder conversations and test messaging in a safe simulation."
                  aria-label="Practice stakeholder conversations and test messaging in a safe simulation."
                  className="flex w-full items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-left transition hover:border-indigo-400 hover:bg-slate-900"
                >
                  <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white text-xs">NT</div>
                  <div className="text-sm text-slate-200">Niar Tun - Agribusiness Exporter from Myanmar</div>
                </button>
                <button
                  type="button"
                  onClick={() => openAssistant('asst_9KTRSFnH5aFCZtAmWNaeRLVZ', 'Sarah Whitmore - Senior Programme Manager at FCDO')}
                  title="Practice stakeholder conversations and test messaging in a safe simulation."
                  aria-label="Practice stakeholder conversations and test messaging in a safe simulation."
                  className="flex w-full items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-left transition hover:border-indigo-400 hover:bg-slate-900"
                >
                  <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white text-xs">SW</div>
                  <div className="text-sm text-slate-200">Sarah Whitmore - Senior Programme Manager at FCDO</div>
                </button>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-slate-800/60 bg-slate-900/60 p-6 flex flex-col h-full transition hover:-translate-y-0.5 hover:shadow-lg">
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800/70 text-indigo-200">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M5 6h14" />
                    <path d="M5 12h14" />
                    <path d="M5 18h9" />
                    <path d="M16 18l2 2 4-4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold">Rapid Diagnostics</h3>
              </div>
              <p className="text-sm text-slate-400">
                Run structured capacity and performance assessments.
              </p>
              <div className="mt-2 flex flex-wrap gap-3">
                <a
                  href="https://form.typeform.com/to/QLgS0bbC"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Structured capacity assessment with scoring and gap analysis."
                  aria-label="Structured capacity assessment with scoring and gap analysis."
                  className="rounded-full bg-indigo-500 px-4 py-2 text-sm font-semibold hover:bg-indigo-400 transition-colors"
                >
                  Organization Self-Assessment Survey
                </a>
                <button
                  type="button"
                  onClick={() => openAssistant('asst_hHsISiXIwBAUtUtCxmIggMd8', 'Organization Diagnostic Virtual Coach')}
                  title="AI-guided diagnostic with recommendations and improvement roadmap."
                  aria-label="AI-guided diagnostic with recommendations and improvement roadmap."
                  className="rounded-full bg-indigo-500 px-4 py-2 text-sm font-semibold hover:bg-indigo-400 transition-colors"
                >
                  Organization Diagnostic Virtual Coach
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8">
          <h2 className="text-2xl font-semibold">PartnerAI™</h2>
          <h3 className="mt-1 text-lg font-semibold">Built for adoption, not deployment</h3>

          <p className="mt-2 text-slate-400">
            PartnerAI™ works because MarketEdge stays involved and knows how social impact systems actually operate. Our team brings decades of experience advising donors, investors, large implementing partners, and on-the-ground NGOs and social enterprises.
          </p>

          <p className="mt-2 text-slate-400">
            We have seen where delivery breaks down, where reporting distorts incentives, and where insight fails to translate into action. Most AI tools ignore these realities. MarketEdge treats PartnerAI™ as an organizational capability shaped by governance, incentives, and decision authority, not a software install.
          </p>

          <p className="mt-2 text-slate-400">
            This experience allows us to embed intelligence where decisions occur, so AI supports action instead of adding parallel systems.
          </p>

          <div className="mt-5 rounded-lg bg-gradient-to-r from-indigo-500/30 to-indigo-400/20 p-4 border border-indigo-500/50">
            <h4 className="text-sm font-semibold text-blue-100">Impact Snapshot</h4>
            <div className="mt-2 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="text-center">
                  <div className="text-2xl font-bold text-white">Over 100k</div>
                  <div className="text-xs text-blue-200">people reached</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">45%</div>
                <div className="text-xs text-blue-200">Avg. cost reduction</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">120+</div>
                <div className="text-xs text-blue-200">organizations strengthened</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">8x</div>
                <div className="text-xs text-blue-200">Faster reporting</div>
              </div>
              </div>
          </div>

          <h3 className="mt-5 text-lg font-semibold">Shaped around how your organization actually works</h3>

          <p className="mt-2 text-slate-400">
            MarketEdge starts with your reality, not a template. We analyze how delivery, portfolio management, and governance function today: who decides, what evidence carries weight, where coordination slows, and where reporting adds friction.
          </p>

          <p className="mt-2 text-slate-400">
            We then tailor PartnerAI™ to those dynamics, aligning agents, dashboards, and outputs to roles, incentives, and decision cadence across teams and partners.
          </p>

          <h3 className="mt-5 text-lg font-semibold">Embedded into live work</h3>

          <p className="mt-2 text-slate-400">
            PartnerAI™ integrates directly into day-to-day delivery. MarketEdge configures workflows that support proposal development, diagnostics, synthesis, learning, and oversight inside the processes teams already use.
          </p>

          <p className="mt-2 text-slate-400">Our work typically includes:</p>

          <ul className="mt-2 list-disc list-inside text-slate-400 space-y-1">
            <li>Mapping delivery and governance workflows</li>
            <li>Clarifying decision rights and evidence needs</li>
            <li>Configuring role-specific agents and dashboards</li>
            <li>Embedding AI into live delivery and oversight</li>
            <li>Supporting adoption through targeted change management and iteration</li>
          </ul>

          <p className="mt-2 text-slate-400">
            As priorities and partnerships evolve, MarketEdge adapts PartnerAI™ to keep it relevant and useful.
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-slate-300">
        <h3 className="text-lg font-semibold">MarketEdge Impact Over the Last Two Years</h3>
        <p className="mt-1 text-sm">Delivered using PartnerAI-enabled workflows, analytics, and learning tools</p>

        <ul className="mt-2 list-disc list-inside text-sm space-y-1">
          <li>30+ engagements delivered for 20+ partners across development, humanitarian, and conservation portfolios.</li>
          <li>Capacity strengthened for 130+ organizations,</li>
          <li>140+ analytic and decision-support products delivered, including market landscapes, political economy analyses, and organizational strategies and action plans.</li>
          <li>Over $10M in funding and investment catalyzed for partners and clients through AI-supported analysis and decision materials.</li>
        </ul>
      </div>

      <div className="mt-6 text-center text-sm text-slate-400">
        <p>
          Contact: <a href="mailto:info@marketedgeglobal.com" className="text-indigo-400 hover:text-indigo-300 hover:underline">info@marketedgeglobal.com</a>
        </p>
      </div>

      {isChatOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="flex w-full max-w-2xl h-[80vh] flex-col overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
              <div>
                <div className="text-lg font-semibold">{currentAssistantName}</div>
                <div className="text-sm text-slate-400">Ask about messaging, finance, or workflows. Attach files for review.</div>
              </div>
              <button
                className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300 hover:text-slate-100"
                onClick={() => setIsChatOpen(false)}
              >
                Close
              </button>
            </div>
            <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-6 py-4 text-sm">
              {messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                      message.role === "user"
                        ? "bg-indigo-500 text-white"
                        : "bg-slate-900 text-slate-200"
                    }`}
                  >
                    {formatMessageContent(message.content)}
                  </div>
                </div>
              ))}
              <div ref={messageEndRef} />
            </div>
            {errorMessage && (
              <div className="border-t border-slate-800 px-6 py-3 text-sm text-rose-400">
                {errorMessage}
              </div>
            )}
            {attachedFiles.length > 0 && (
              <div className="border-t border-slate-800 px-6 py-3">
                <div className="text-xs text-slate-400 mb-2">Attached files:</div>
                <div className="space-y-2">
                  {attachedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-slate-900 rounded-lg px-3 py-2">
                      <div className="text-sm text-slate-300">
                        <span className="truncate max-w-xs">{file.name}</span>
                        <span className="text-xs text-slate-500 ml-2">({(file.size / 1024).toFixed(1)} KB)</span>
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        className="text-slate-400 hover:text-rose-400 ml-2"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="border-t border-slate-800 p-4">
              <div className="flex items-center gap-2 mb-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  accept=".txt,.pdf,.doc,.docx,.xls,.xlsx,.csv,.jpg,.jpeg,.png,.gif"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-full border border-slate-600 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-900"
                  title="Attach files (PDF, Word, Excel, images, etc.)"
                >
                  📎 Attach
                </button>
              </div>
              <div className="flex items-center gap-3">
                <input
                  ref={inputRef}
                  className="flex-1 rounded-full border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-indigo-400"
                    placeholder={isChatOpen ? `Ask ${currentAssistantName}...` : "Ask the coach..."}
                  value={inputValue}
                  onChange={(event) => setInputValue(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      void handleSend();
                    }
                  }}
                />
                <button
                  className="rounded-full bg-indigo-500 px-6 py-3 text-sm font-semibold hover:bg-indigo-400 disabled:opacity-50 transition-colors"
                  onClick={() => void handleSend()}
                  disabled={isSending}
                >
                  {isSending ? "..." : "Send"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
