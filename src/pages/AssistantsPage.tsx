import { useEffect, useRef, useState, type ReactNode } from "react";
import { sendMessage, type ChatMessage } from "../lib/openai";

interface AttachedFile {
  name: string;
  size: number;
  file?: File;
}

export function AssistantsPage() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [currentAssistantId, setCurrentAssistantId] = useState<string | null>(null);
  const [currentAssistantName, setCurrentAssistantName] = useState<string>("");
  const [currentAssistantDescription, setCurrentAssistantDescription] = useState<string>("");
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const initialMessageCountRef = useRef(0);
  const didAutoOpenRef = useRef(false);
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
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setErrorMessage(null);
    setIsSending(true);

    let uploaded: { id: string; name: string }[] = [];
    if (attachedFiles.length > 0) {
      try {
        const agentApi = import.meta.env.VITE_AGENT_API_URL as string | undefined;
        let uploadUrl: string;
        if (agentApi) {
          uploadUrl = new URL("upload", agentApi).toString();
        } else if (import.meta.env.BASE_URL && import.meta.env.BASE_URL !== "/") {
          uploadUrl = new URL("upload", window.location.origin + (import.meta.env.BASE_URL ?? "/")).toString();
        } else {
          uploadUrl = "/upload";
        }

        const form = new FormData();
        attachedFiles.forEach((f) => {
          if (f.file) form.append("files", f.file);
        });

        const upResp = await fetch(uploadUrl, { method: "POST", body: form });
        if (!upResp.ok) {
          const txt = await upResp.text();
          throw new Error(`Upload failed: ${txt}`);
        }
        const upData = await upResp.json();
        uploaded = upData.files || [];
      } catch (err) {
        const message = err instanceof Error ? err.message : "Upload failed";
        setErrorMessage(message);
        setIsSending(false);
        return;
      }
    }

    const placeholderText = "Thinking...";
    const assistantPlaceholder: ChatMessage = { role: "assistant", content: placeholderText };
    setMessages((prev) => [...prev, assistantPlaceholder]);

    try {
      if (!currentAssistantId) throw new Error("No assistant selected");
      const conversationHistory = messages
        .slice(initialMessageCountRef.current)
        .filter((m) => m.content !== placeholderText);
      conversationHistory.push(userMessage);
      const reply = await sendMessage(conversationHistory, currentAssistantId, uploaded.length ? uploaded : undefined);

      setMessages((prev) => {
        const copy = [...prev];
        const lastIdx = copy.map((m) => m.content).lastIndexOf(placeholderText);
        if (lastIdx !== -1) {
          copy[lastIdx] = { role: "assistant", content: reply };
          return copy;
        }
        return [...prev, { role: "assistant", content: reply }];
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unexpected error";
      setErrorMessage(message);
      setMessages((prev) => prev.filter((m) => m.content !== "Thinking..."));
    } finally {
      setAttachedFiles([]);
      setIsSending(false);
    }
  };

  const openAssistant = (id: string | null, name: string) => {
    const financialId = import.meta.env.VITE_OPENAI_FINANCIAL_ASSISTANT_ID ?? "asst_2BNcG5OJXbPfhDmCadhC7aGM";
    const operationsId = import.meta.env.VITE_OPENAI_OPERATIONS_ASSISTANT_ID ?? "asst_pGMkUNldDi6EXOQKvpM26Gtb";
    const bdId = import.meta.env.VITE_OPENAI_BD_ASSISTANT_ID ?? "asst_yzDWzTYPE7bJf4vbqQlklmiP";
    const marketingId = import.meta.env.VITE_OPENAI_MARKETING_ASSISTANT_ID ?? "asst_8XjZDwU3nU8PzDcqcOHqK2KU";

    const resolvedId = id ?? (name === "Financial Management Help" ? financialId
      : name === "Operations Systems Support" ? operationsId
      : name === "Business Development Assistant" ? bdId
      : name === "Marketing & Communications Assistant" ? marketingId
      : null);
    setCurrentAssistantId(resolvedId);
    setCurrentAssistantName(name);

    let description = "";
    if (name === "Financial Management Help" || id === financialId) {
      description = "Ask about financial management, budgeting, forecasts, and reporting.";
    } else if (name === "Operations Systems Support" || id === operationsId) {
      description = "Ask about system architecture, deployments, integrations, and automations.";
    } else if (name === "Business Development Assistant" || id === bdId) {
      description = "Ask about partnership outreach, market research, and engagement strategies.";
    } else if (name === "Marketing & Communications Assistant" || id === marketingId) {
      description = "Ask about messaging strategy, campaign planning, and brand positioning.";
    }
    setCurrentAssistantDescription(description);

    let initialMessages: ChatMessage[] = [];
    if (name === "Financial Management Help" || id === financialId) {
      initialMessages = [
        {
          role: "assistant",
          content:
            "Hello — I'm here to help with financial management, budgeting, and reporting. Ask about forecasts, cashflow, expense categorization, or attach financial documents for review.",
        },
      ];
    } else if (name === "Operations Systems Support" || id === operationsId) {
      initialMessages = [
        {
          role: "assistant",
          content:
            "Hi — I'm the Operations Systems assistant. I can help with system architecture, deployments, monitoring, integrations, runbooks, and automations. Attach diagrams, configs, or logs and I'll review them.",
        },
      ];
    } else if (name === "Business Development Assistant" || id === bdId) {
      initialMessages = [
        {
          role: "assistant",
          content:
            "Hello — I'm the Business Development Support assistant. I can help with partnership outreach, proposal framing, market research, and engagement strategies. Attach briefs or partner info and I'll provide recommendations.",
        },
      ];
    } else if (name === "Marketing & Communications Assistant" || id === marketingId) {
      initialMessages = [
        {
          role: "assistant",
          content:
            "Hello — I'm the Marketing and Communications assistant. I can help with strategy development, messaging, campaign planning, stakeholder communication, and brand positioning. Attach briefs, messaging documents, or communication plans for feedback.",
        },
      ];
    }
    initialMessageCountRef.current = initialMessages.length;
    setMessages(initialMessages);
    setIsChatOpen(true);
  };

  useEffect(() => {
    const openFromHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (!hash) return;
      if (!didAutoOpenRef.current) {
        didAutoOpenRef.current = true;
      }
      if (hash === "financial-management") {
        openAssistant(import.meta.env.VITE_OPENAI_FINANCIAL_ASSISTANT_ID ?? "asst_2BNcG5OJXbPfhDmCadhC7aGM", "Financial Management Help");
      } else if (hash === "operations-systems") {
        openAssistant(import.meta.env.VITE_OPENAI_OPERATIONS_ASSISTANT_ID ?? "asst_pGMkUNldDi6EXOQKvpM26Gtb", "Operations Systems Support");
      } else if (hash === "business-development") {
        openAssistant(import.meta.env.VITE_OPENAI_BD_ASSISTANT_ID ?? "asst_yzDWzTYPE7bJf4vbqQlklmiP", "Business Development Assistant");
      } else if (hash === "marketing-comms") {
        openAssistant(import.meta.env.VITE_OPENAI_MARKETING_ASSISTANT_ID ?? "asst_8XjZDwU3nU8PzDcqcOHqK2KU", "Marketing & Communications Assistant");
      }
    };

    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, []);

  const formatMessageContent = (content: string): ReactNode => {
    if (!content) return null;
    const lines = content.replace(/\r\n/g, "\n").split("\n");
    const nodes: ReactNode[] = [];
    let i = 0;
    let keyIndex = 0;

    while (i < lines.length) {
      if (lines[i].trim() === "") {
        i++;
        continue;
      }

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
      <section id="assistants" className="rounded-3xl border border-[var(--color-card-border)] bg-gradient-to-b from-[var(--color-card-gradient-top)] to-[var(--color-card-gradient-bottom)] p-8 shadow-[var(--shadow-card)] transition hover:-translate-y-1 hover:shadow-[0_20px_44px_rgba(0,0,0,0.38)]">
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold text-[var(--color-heading)]">On-the-Job AI Assistants</h3>
          <p className="text-sm text-[var(--color-body)]">
            AI-powered task companions embedded into real workflows. These assistants help teams move faster on
            budgeting, operations, and proposal development without leaving existing processes. The examples below
            mirror typical day-to-day usage.
          </p>
          <ul className="list-disc list-inside text-sm text-[var(--color-body)] space-y-1">
            <li>Budget drafts, reconciliations, and compliance checks.</li>
            <li>SOP and process updates to improve internal coordination.</li>
            <li>Proposal drafting with clear alignment to RFP criteria.</li>
          </ul>
          <a
            href="mailto:info@marketedgeglobal.com?subject=PartnerAI Inquiry - AI Assistants&body=Hello MarketEdge team,%0D%0A%0D%0AI am interested in learning more about the AI Assistants in PartnerAI.%0D%0A%0D%0AThank you."
            className="inline-block rounded-full bg-gradient-to-r from-[var(--color-cta-gradient-top)] to-[var(--color-cta-gradient-bottom)] px-6 py-3.5 text-sm font-semibold text-[var(--color-cta-text)] shadow-[var(--shadow-cta)] transition hover:from-[var(--color-cta-hover-top)] hover:to-[var(--color-cta-hover-bottom)]"
            <button
              type="button"
              onClick={() => openAssistant(import.meta.env.VITE_OPENAI_FINANCIAL_ASSISTANT_ID ?? "asst_2BNcG5OJXbPfhDmCadhC7aGM", "Financial Management Help")}
              className="rounded-full bg-[var(--color-pill-bg)] px-4 py-2 text-sm font-semibold text-[var(--color-pill-text)] border border-[var(--color-pill-border)] hover:bg-[var(--color-pill-hover-bg)] hover:border-[var(--color-pill-hover-border)] transition-all duration-150 ease-out w-fit"
            >
      </section>
            </button>
      <div className="mt-16 space-y-8">
        <section id="financial-management" className="rounded-3xl border border-[var(--color-card-border)] bg-gradient-to-b from-[var(--color-card-gradient-top)] to-[var(--color-card-gradient-bottom)] p-8 min-h-[120px]">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
            <h3 className="text-lg font-semibold text-[var(--color-heading)]">Financial Management Help</h3>
            <a
              href={`${import.meta.env.BASE_URL}?assistant=financial-management#assistants`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-[var(--color-pill-bg)] px-4 py-2 text-sm font-semibold text-[var(--color-pill-text)] border border-[var(--color-pill-border)] hover:bg-[var(--color-pill-hover-bg)] hover:border-[var(--color-pill-hover-border)] transition-all duration-150 ease-out w-fit"
            <button
              type="button"
              onClick={() => openAssistant(import.meta.env.VITE_OPENAI_OPERATIONS_ASSISTANT_ID ?? "asst_pGMkUNldDi6EXOQKvpM26Gtb", "Operations Systems Support")}
              className="rounded-full bg-[var(--color-pill-bg)] px-4 py-2 text-sm font-semibold text-[var(--color-pill-text)] border border-[var(--color-pill-border)] hover:bg-[var(--color-pill-hover-bg)] hover:border-[var(--color-pill-hover-border)] transition-all duration-150 ease-out w-fit"
            >
          <div className="space-y-2 text-sm text-[var(--color-body)]">
            </button>
            <div><span className="font-medium text-[var(--color-heading)]">Typical inputs:</span> Budget templates, transaction data, financial policies, compliance requirements.</div>
            <div><span className="font-medium text-[var(--color-heading)]">Typical outputs:</span> Budget drafts, reconciliation summaries, compliance checklists, risk flags.</div>
          </div>
        </section>
            <button
              type="button"
              onClick={() => openAssistant(import.meta.env.VITE_OPENAI_BD_ASSISTANT_ID ?? "asst_yzDWzTYPE7bJf4vbqQlklmiP", "Business Development Assistant")}
              className="rounded-full bg-[var(--color-pill-bg)] px-4 py-2 text-sm font-semibold text-[var(--color-pill-text)] border border-[var(--color-pill-border)] hover:bg-[var(--color-pill-hover-bg)] hover:border-[var(--color-pill-hover-border)] transition-all duration-150 ease-out w-fit"
            >
            <a
            </button>
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-[var(--color-pill-bg)] px-4 py-2 text-sm font-semibold text-[var(--color-pill-text)] border border-[var(--color-pill-border)] hover:bg-[var(--color-pill-hover-bg)] hover:border-[var(--color-pill-hover-border)] transition-all duration-150 ease-out w-fit"
            <button
              type="button"
              onClick={() => openAssistant(import.meta.env.VITE_OPENAI_MARKETING_ASSISTANT_ID ?? "asst_8XjZDwU3nU8PzDcqcOHqK2KU", "Marketing & Communications Assistant")}
              className="rounded-full bg-[var(--color-pill-bg)] px-4 py-2 text-sm font-semibold text-[var(--color-pill-text)] border border-[var(--color-pill-border)] hover:bg-[var(--color-pill-hover-bg)] hover:border-[var(--color-pill-hover-border)] transition-all duration-150 ease-out w-fit"
            >
          <div className="space-y-2 text-sm text-[var(--color-body)]">
            </button>
            <div><span className="font-medium text-[var(--color-heading)]">Typical inputs:</span> Current SOPs, workflow diagrams, staff feedback, operational challenges.</div>
            <div><span className="font-medium text-[var(--color-heading)]">Typical outputs:</span> Revised SOPs, process improvements, coordination guides, implementation plans.</div>
          </div>
        </section>

        <section id="business-development" className="rounded-3xl border border-[var(--color-card-border)] bg-gradient-to-b from-[var(--color-card-gradient-top)] to-[var(--color-card-gradient-bottom)] p-8 min-h-[120px]">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
            <h3 className="text-lg font-semibold text-[var(--color-heading)]">Business Development Assistant</h3>
            <a
              href={`${import.meta.env.BASE_URL}?assistant=business-development#assistants`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-[var(--color-pill-bg)] px-4 py-2 text-sm font-semibold text-[var(--color-pill-text)] border border-[var(--color-pill-border)] hover:bg-[var(--color-pill-hover-bg)] hover:border-[var(--color-pill-hover-border)] transition-all duration-150 ease-out w-fit"
            >
              Business Development Assistant
            </a>
          </div>
          <div className="space-y-2 text-sm text-[var(--color-body)]">
            <div><span className="font-medium text-[var(--color-heading)]">What it helps with:</span> Draft proposal sections, check RFP alignment, and analyze partner fit.</div>
            <div><span className="font-medium text-[var(--color-heading)]">Typical inputs:</span> RFP documents, organizational capabilities, previous proposals, partner profiles.</div>
            <div><span className="font-medium text-[var(--color-heading)]">Typical outputs:</span> Proposal drafts, RFP compliance analysis, partner assessment, competitive positioning.</div>
          </div>
        </section>

        <section id="marketing-comms" className="rounded-3xl border border-[var(--color-card-border)] bg-gradient-to-b from-[var(--color-card-gradient-top)] to-[var(--color-card-gradient-bottom)] p-8 min-h-[120px]">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
            <h3 className="text-lg font-semibold text-[var(--color-heading)]">Marketing & Communications Assistant</h3>
            <a
              href={`${import.meta.env.BASE_URL}?assistant=marketing-comms#assistants`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-[var(--color-pill-bg)] px-4 py-2 text-sm font-semibold text-[var(--color-pill-text)] border border-[var(--color-pill-border)] hover:bg-[var(--color-pill-hover-bg)] hover:border-[var(--color-pill-hover-border)] transition-all duration-150 ease-out w-fit"
            >
              Marketing & Communications Assistant
            </a>
          </div>
          <div className="space-y-2 text-sm text-[var(--color-body)]">
            <div><span className="font-medium text-[var(--color-heading)]">What it helps with:</span> Generate donor updates, messaging drafts, and strategic communications.</div>
            <div><span className="font-medium text-[var(--color-heading)]">Typical inputs:</span> Program results, impact data, donor briefs, communication objectives.</div>
            <div><span className="font-medium text-[var(--color-heading)]">Typical outputs:</span> Donor updates, messaging frameworks, communications drafts, impact narratives.</div>
          </div>
        </section>
      </div>

      {isChatOpen && (
        <div className="chat-modal fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="chat-modal-card flex w-full max-w-xl h-[70vh] flex-col overflow-hidden rounded-3xl border border-[var(--color-card-border)] bg-[var(--color-card-gradient-bottom)] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--color-card-border)] px-6 py-4">
              <div>
                <div className="text-lg font-semibold">{currentAssistantName}</div>
                <div className="text-sm text-[var(--color-body)]">{currentAssistantDescription}</div>
              </div>
              <button
                className="rounded-full border border-[var(--color-card-border)] px-3 py-1 text-xs text-[var(--color-body)] hover:text-[var(--color-heading)]"
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
                        ? "bg-[var(--color-cta-gradient-top)] text-[var(--color-cta-text)]"
                        : "bg-[var(--color-card-gradient-top)] text-[var(--color-body)]"
                    }`}
                  >
                    {formatMessageContent(message.content)}
                  </div>
                </div>
              ))}
              <div ref={messageEndRef} />
            </div>
            {errorMessage && (
              <div className="border-t border-[var(--color-card-border)] px-6 py-3 text-sm text-rose-300">
                {errorMessage}
              </div>
            )}
            {attachedFiles.length > 0 && (
              <div className="border-t border-[var(--color-card-border)] px-6 py-3">
                <div className="text-xs text-[var(--color-muted)] mb-2">Attached files:</div>
                <div className="space-y-2">
                  {attachedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-[var(--color-card-gradient-top)] rounded-lg px-3 py-2">
                      <div className="text-sm text-[var(--color-body)]">
                        <span className="truncate max-w-xs">{file.name}</span>
                        <span className="text-xs text-[var(--color-muted)] ml-2">({(file.size / 1024).toFixed(1)} KB)</span>
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        className="text-[var(--color-muted)] hover:text-rose-300 ml-2"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="border-t border-[var(--color-card-border)] p-4">
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
                  className="rounded-full border border-[var(--color-card-border)] px-3 py-2 text-xs font-semibold text-[var(--color-body)] hover:bg-[var(--color-card-gradient-top)]"
                  title="Attach files (PDF, Word, Excel, images, etc.)"
                >
                  📎 Attach
                </button>
              </div>
              <div className="flex items-center gap-3">
                <input
                  ref={inputRef}
                  className="flex-1 rounded-full border border-[var(--color-card-border)] bg-[var(--color-card-gradient-top)] px-4 py-3 text-sm text-[var(--color-body)] outline-none focus:border-[var(--color-icon-accent)]"
                  placeholder={isChatOpen ? `Ask ${currentAssistantName}...` : "Ask the assistant..."}
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
                  className="rounded-full bg-gradient-to-r from-[var(--color-cta-gradient-top)] to-[var(--color-cta-gradient-bottom)] px-6 py-3 text-sm font-semibold text-[var(--color-cta-text)] shadow-[var(--shadow-cta)] transition hover:from-[var(--color-cta-hover-top)] hover:to-[var(--color-cta-hover-bottom)] disabled:opacity-50"
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
