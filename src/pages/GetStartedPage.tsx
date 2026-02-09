import { useEffect, useRef, useState, type ReactNode } from "react";
import { sendMessage, type ChatMessage } from "../lib/openai";

type PageProps = {};

interface AttachedFile {
  name: string;
  size: number;
}

export function GetStartedPage(_: PageProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  interface AssistantItem { id: string | null; name: string; description?: string }
  const [assistants, setAssistants] = useState<AssistantItem[]>([]);
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
  const inputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isChatOpen) return;
    inputRef.current?.focus();
  }, [isChatOpen]);

  useEffect(() => {
    async function loadAssistants() {
      // Build URL similar to sendMessage so this works under a subpath or with a remote agent API
      const agentApi = import.meta.env.VITE_AGENT_API_URL as string | undefined;
      let url: string;
      if (agentApi) {
        url = new URL('assistants', agentApi).toString();
      } else if (import.meta.env.BASE_URL && import.meta.env.BASE_URL !== '/') {
        url = new URL('assistants', window.location.origin + (import.meta.env.BASE_URL ?? '/')).toString();
      } else {
        url = '/assistants';
      }

      try {
        const resp = await fetch(url);
        if (resp.ok) {
          const data = await resp.json();
          if (Array.isArray(data?.assistants)) {
            setAssistants(data.assistants);
            return;
          }
        }
      } catch (err) {
        // ignore and fall back to env-built list
      }

      // Fallback: build assistant list from env vars / hard-coded defaults
      const fallback = [] as AssistantItem[];
      fallback.push({ id: import.meta.env.VITE_OPENAI_FINANCIAL_ASSISTANT_ID ?? 'asst_2BNcG5OJXbPfhDmCadhC7aGM', name: 'Financial Management Help' });
      fallback.push({ id: import.meta.env.VITE_OPENAI_OPERATIONS_ASSISTANT_ID ?? 'asst_pGMkUNldDi6EXOQKvpM26Gtb', name: 'Operations Systems' });
      fallback.push({ id: import.meta.env.VITE_OPENAI_BD_ASSISTANT_ID ?? 'asst_yzDWzTYPE7bJf4vbqQlklmiP', name: 'Business Development Support' });
      fallback.push({ id: import.meta.env.VITE_OPENAI_MARKETING_ASSISTANT_ID ?? 'asst_8XjZDwU3nU8PzDcqcOHqK2KU', name: 'Marketing and Communications' });
      // New Learning Companion assistant: Ramiro - The Bolivian Rancher
      fallback.push({ id: import.meta.env.VITE_OPENAI_RAMIRO_ASSISTANT_ID ?? 'asst_LwQ63jo5RMN3WTwMeSnTRbun', name: 'Ramiro - The Bolivian Rancher' });
      setAssistants(fallback);
    }

    void loadAssistants();
  }, []);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isChatOpen]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles: AttachedFile[] = Array.from(files).map((file) => ({
        name: file.name,
        size: file.size,
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

    let messageText = inputValue.trim();
    if (attachedFiles.length > 0) {
      messageText += `\n\n[Attachments: ${attachedFiles.map((f) => f.name).join(", ")}]`;
    }

    const userMessage: ChatMessage = { role: "user", content: messageText };
    const placeholderText = "Thinking...";
    const assistantPlaceholder: ChatMessage = { role: "assistant", content: placeholderText };
    // Compute the index where the placeholder will be inserted so we can
    // reliably replace or remove it later even if messages update.
    const placeholderIndex = messages.length + 1;
    const nextMessages = [...messages, userMessage, assistantPlaceholder];
    setMessages(nextMessages);
    setInputValue("");
    setAttachedFiles([]);
    setIsSending(true);
    setErrorMessage(null);

    try {
      if (!currentAssistantId) {
        throw new Error("No assistant selected");
      }
      const reply = await sendMessage(messageText, currentAssistantId);
      setMessages((prev) => {
        const copy = [...prev];
        if (copy[placeholderIndex] && copy[placeholderIndex].content === placeholderText) {
          copy[placeholderIndex] = { role: "assistant", content: reply };
          return copy;
        }
        // Fallback: append if placeholder not found
        return [...prev, { role: "assistant", content: reply }];
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unexpected error";
      setErrorMessage(message);
      // Remove the placeholder if present so the UI doesn't show a stale "Thinking..." message
      setMessages((prev) => prev.filter((_, idx) => idx !== placeholderIndex));
    } finally {
      setIsSending(false);
    }
  };

  

  const openAssistant = (id: string | null, name: string) => {
    const financialId = import.meta.env.VITE_OPENAI_FINANCIAL_ASSISTANT_ID ?? 'asst_2BNcG5OJXbPfhDmCadhC7aGM';
    const operationsId = import.meta.env.VITE_OPENAI_OPERATIONS_ASSISTANT_ID ?? 'asst_pGMkUNldDi6EXOQKvpM26Gtb';
    const bdId = import.meta.env.VITE_OPENAI_BD_ASSISTANT_ID ?? 'asst_yzDWzTYPE7bJf4vbqQlklmiP';
    const marketingId = import.meta.env.VITE_OPENAI_MARKETING_ASSISTANT_ID ?? 'asst_8XjZDwU3nU8PzDcqcOHqK2KU';
    const ramiroId = import.meta.env.VITE_OPENAI_RAMIRO_ASSISTANT_ID ?? 'asst_LwQ63jo5RMN3WTwMeSnTRbun';

    // Resolve a null id to the expected assistant id based on name, ensuring
    // we always have an assistant_id when sending messages.
    const resolvedId = id ?? (name === 'Financial Management Help' ? financialId : name === 'Operations Systems' ? operationsId : name === 'Business Development Support' ? bdId : name === 'Marketing and Communications' ? marketingId : null);
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
    } else if (name === "Operations Systems" || id === operationsId) {
      initialMessages = [
        {
          role: "assistant",
          content:
            "Hi — I'm the Operations Systems assistant. I can help with system architecture, deployments, monitoring, integrations, runbooks, and automations. Attach diagrams, configs, or logs and I'll review them.",
        },
      ];
    } else if (name === "Business Development Support" || id === bdId) {
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
    }
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
      <div className="space-y-8">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">PartnerAI™</p>
          <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
            Democratizing AI for Social Impact.
          </h1>
          <p className="mt-4 text-lg text-slate-300 max-w-3xl">
            PartnerAI™ is a proprietary, trademarked AI platform developed and owned by MarketEdge. It embeds AI directly into delivery, portfolio management, and decision-making workflows for social impact organizations operating across multiple stakeholders, incentives, and reporting demands.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col h-full">
            <div className="flex-1 space-y-3">
              <h3 className="text-lg font-semibold">Advanced Analytics</h3>
              <p className="text-sm text-slate-400">
                Leverage our agents trained in advanced analytics for data-driven insights, streamlining
                decision-making and program effectiveness.
              </p>
              <div className="mt-3">
                <a
                  href="https://marketedgeglobal.github.io/marketedgeglobal/explore-platform/ranking-tool/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold hover:bg-sky-600"
                >
                  Ranking Tool
                </a>
                <button
                  onClick={() => openAssistant('asst_5NTh5OINlU3NoN0ROHFOXrrp', 'Publication Review')}
                  className="ml-3 rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold hover:bg-sky-600"
                >
                  Publication Review
                </button>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col h-full">
            <div className="flex-1 space-y-3">
              <h3 className="text-lg font-semibold">Practice Engaging Stakeholders</h3>
              <p className="text-sm text-slate-400">
                Explore different perspectives and prepare for your next engagement.
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                {assistants
                  .filter((a) => a.name.includes('Ramiro'))
                  .map((a) => (
                    <button
                      key={a.name}
                      className="rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold hover:bg-sky-600"
                      onClick={() => openAssistant(a.id, a.name)}
                    >
                      {a.name}
                    </button>
                  ))}
                <button
                  onClick={() => openAssistant('asst_Efsxetzg8NyymK7AIit4knip', 'Jannatul - Bangladeshi University Student')}
                  className="rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold hover:bg-sky-600"
                >
                  Jannatul - Bangladeshi University Student
                </button>
                <button
                  onClick={() => openAssistant('asst_zHLROcxpPw6Ho1AOlZh3Sv7N', 'Nilar Tun - Agribusiness Exporter from Myanmar')}
                  className="rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold hover:bg-sky-600"
                >
                  Nilar Tun - Agribusiness Exporter from Myanmar
                </button>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col h-full">
            <div className="flex-1 space-y-3">
              <h3 className="text-lg font-semibold">On-the-Job Task Assistants</h3>
              <p className="text-sm text-slate-400">
                Optimize workflows and improve productivity with AI-driven assistants for key
                organizational tasks.
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                {assistants
                  .filter((a) => !a.name.includes('Ramiro'))
                  .map((a) => {
                  const name = a.name;
                  const cls = 'rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold hover:bg-sky-600';

                  return (
                    <button key={name} className={cls} onClick={() => openAssistant(a.id, a.name)}>
                        {a.name}
                      </button>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col h-full">
            <div className="flex-1 space-y-3">
              <h3 className="text-lg font-semibold">Rapid Diagnostics</h3>
              <p className="text-sm text-slate-400">
                Gain comprehensive assessments of organizational capacity and performance for strategic
                growth and impact.
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                <a
                  href="https://form.typeform.com/to/QLgS0bbC"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold hover:bg-sky-600"
                >
                  Organization Self-Assessment Survey
                </a>
                <button
                  onClick={() => openAssistant('asst_hHsISiXIwBAUtUtCxmIggMd8', 'Organization Diagnostic Virtual Coach')}
                  className="rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold hover:bg-sky-600"
                >
                  Organization Diagnostic Virtual Coach
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8">
          <h2 className="text-2xl font-semibold">PartnerAI™</h2>
          <h3 className="text-lg font-semibold">Built for adoption, not deployment</h3>

          <p className="mt-3 text-slate-400">
            PartnerAI™ works because MarketEdge stays involved and knows how social impact systems actually operate. Our team brings decades of experience advising donors, investors, large implementing partners, and on-the-ground NGOs and social enterprises.
          </p>

          <p className="mt-3 text-slate-400">
            We have seen where delivery breaks down, where reporting distorts incentives, and where insight fails to translate into action. Most AI tools ignore these realities. MarketEdge treats PartnerAI™ as an organizational capability shaped by governance, incentives, and decision authority, not a software install.
          </p>

          <p className="mt-3 text-slate-400">
            This experience allows us to embed intelligence where decisions occur, so AI supports action instead of adding parallel systems.
          </p>

          <div className="mt-6 rounded-lg bg-gradient-to-r from-sky-800/60 to-sky-700/40 p-4 border border-sky-700">
            <h4 className="text-sm font-semibold text-sky-100">Impact Snapshot</h4>
            <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="text-center">
                  <div className="text-2xl font-bold text-white">Over 100k</div>
                  <div className="text-xs text-sky-200">people reached</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">45%</div>
                <div className="text-xs text-sky-200">Avg. cost reduction</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">120+</div>
                <div className="text-xs text-sky-200">organizations strengthened</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">8x</div>
                <div className="text-xs text-sky-200">Faster reporting</div>
              </div>
              </div>
          </div>

          <h3 className="mt-6 text-lg font-semibold">Shaped around how your organization actually works</h3>

          <p className="mt-3 text-slate-400">
            MarketEdge starts with your reality, not a template. We analyze how delivery, portfolio management, and governance function today: who decides, what evidence carries weight, where coordination slows, and where reporting adds friction.
          </p>

          <p className="mt-3 text-slate-400">
            We then tailor PartnerAI™ to those dynamics, aligning agents, dashboards, and outputs to roles, incentives, and decision cadence across teams and partners.
          </p>

          <h3 className="mt-6 text-lg font-semibold">Embedded into live work</h3>

          <p className="mt-3 text-slate-400">
            PartnerAI™ integrates directly into day-to-day delivery. MarketEdge configures workflows that support proposal development, diagnostics, synthesis, learning, and oversight inside the processes teams already use.
          </p>

          <p className="mt-3 text-slate-400">Our work typically includes:</p>

          <ul className="mt-3 list-disc list-inside text-slate-400 space-y-2">
            <li>Mapping delivery and governance workflows</li>
            <li>Clarifying decision rights and evidence needs</li>
            <li>Configuring role-specific agents and dashboards</li>
            <li>Embedding AI into live delivery and oversight</li>
            <li>Supporting adoption through targeted change management and iteration</li>
          </ul>

          <p className="mt-3 text-slate-400">
            As priorities and partnerships evolve, MarketEdge adapts PartnerAI™ to keep it relevant and useful.
          </p>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-slate-300">
        <h3 className="text-lg font-semibold">MarketEdge Impact Over the Last Two Years</h3>
        <p className="mt-3 text-sm">Delivered using PartnerAI-enabled workflows, analytics, and learning tools</p>

        <ul className="mt-3 list-disc list-inside text-sm space-y-2">
          <li>30+ engagements delivered for 20+ partners across development, humanitarian, and conservation portfolios.</li>
          <li>Capacity strengthened for 130+ organizations,</li>
          <li>140+ analytic and decision-support products delivered, including market landscapes, political economy analyses, and organizational strategies and action plans.</li>
          <li>Over $10M in funding and investment catalyzed for partners and clients through AI-supported analysis and decision materials.</li>
        </ul>
      </div>

      <div className="mt-6 text-center text-sm text-slate-400">
        <p>
          Contact: <a href="mailto:info@marketedgeglobal.com" className="text-sky-400 hover:underline">info@marketedgeglobal.com</a>
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
                  className="flex-1 rounded-full border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-indigo-500"
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
                  className="rounded-full bg-indigo-500 px-6 py-3 text-sm font-semibold hover:bg-indigo-600 disabled:opacity-50"
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
