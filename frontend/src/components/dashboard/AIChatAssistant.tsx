import React, { useState, useRef, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { useAIChat, ChatMessage } from "../../hooks/useAIChat";
import { Sparkles, X, Send, Copy, RotateCcw, Download, Trash2, Clipboard } from "lucide-react";

export default function AIChatAssistant() {
  const { activeReport, showToast } = useApp();
  const { messages, sendMessage, isTyping, clearChat } = useAIChat(activeReport);
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedChips = [
    "Explain Recommendation",
    "Compare with AMD",
    "Financial Summary",
    "Risk Analysis",
    "Valuation",
    "SWOT"
  ];

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = (textToSend: string) => {
    if (!textToSend.trim()) return;
    sendMessage(textToSend);
    setInput("");
  };

  const handleCopyMessage = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast("Message copied to clipboard!", "success");
  };

  const handleExportChat = () => {
    const textContent = messages
      .map(m => `[${m.sender === "ai" ? "AI Assistant" : "User"} - ${m.timestamp.toLocaleTimeString()}]\n${m.text}\n`)
      .join("\n-----------------------------------\n\n");
    
    const blob = new Blob([textContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${activeReport?.companyResearch.ticker || "Altuni"}_AI_Research_Chat.txt`;
    link.click();
    showToast("Conversation exported successfully.", "success");
  };

  // Helper to parse Markdown-like syntax into HTML safely (handles Headers, Lists, and Tables)
  const parseMarkdown = (mdText: string) => {
    let html = mdText;

    // 1. Headers (e.g. ### Header)
    html = html.replace(/^### (.*?)$/gm, '<h4 class="text-xs font-bold text-primary uppercase tracking-wider mt-4 mb-2">$1</h4>');

    // 2. Bold text (e.g. **bold**)
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-extrabold">$1</strong>');

    // 3. Bullet points (e.g. - list item)
    html = html.replace(/^- (.*?)$/gm, '<li class="ml-4 list-disc text-text-secondary my-1 leading-relaxed">$1</li>');

    // 4. Tables parsing
    const lines = html.split("\n");
    let inTable = false;
    let tableHtml = "";

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (line.startsWith("|") && line.endsWith("|")) {
        // Skip separator line | :--- | :--- |
        if (line.includes("---")) continue;

        if (!inTable) {
          inTable = true;
          tableHtml = '<div class="overflow-x-auto my-3 border border-border/40 rounded-lg bg-muted/20"><table class="w-full text-left text-[10px] border-collapse"><tbody>';
        }

        const cols = line.split("|").slice(1, -1).map(c => c.trim());
        const isHeader = i > 0 && lines[i - 1].includes("---") === false && !inTable; // simple header detection
        
        tableHtml += '<tr class="border-b border-border/20 hover:bg-muted/15">';
        cols.forEach(c => {
          tableHtml += `<td class="p-2 font-medium">${c}</td>`;
        });
        tableHtml += "</tr>";
      } else {
        if (inTable) {
          inTable = false;
          tableHtml += "</tbody></table></div>";
          lines[i - 1] = tableHtml; // insert compiled table html
        }
      }
    }
    
    if (inTable) {
      tableHtml += "</tbody></table></div>";
      lines[lines.length - 1] = tableHtml;
    }

    return lines.join("\n");
  };

  return (
    <>
      {/* Floating Sparkles Bot Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-blue-500 hover:from-primary/90 hover:to-blue-500/90 text-white flex items-center justify-center shadow-2xl shadow-primary/30 transition-all transform hover:scale-110 active:scale-95 cursor-pointer ring-4 ring-primary/20"
        title="Open AI Analyst Assistant"
      >
        <Sparkles className="w-5.5 h-5.5 animate-pulse" />
      </button>

      {/* Slide-out Drawer Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end animate-fade-in select-none">
          {/* Overlay mask */}
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-all"
            onClick={() => setIsOpen(false)}
          />

          {/* Chat Panel Box */}
          <div className="w-[420px] max-w-full bg-[#0A111E]/95 border-l border-border/60 h-full relative z-10 flex flex-col justify-between shadow-2xl backdrop-blur-xl animate-slide-in text-white">
            
            {/* Header */}
            <div className="p-4 border-b border-border/40 flex items-center justify-between shrink-0 bg-card">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">AI Research Assistant</h4>
                  {activeReport && (
                    <p className="text-[9px] text-green font-semibold">Context: {activeReport.companyResearch.ticker} telemetry loaded</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={handleExportChat}
                  className="p-1.5 text-text-secondary hover:text-white rounded-lg hover:bg-muted transition-colors cursor-pointer"
                  title="Export Chat"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={clearChat}
                  className="p-1.5 text-text-secondary hover:text-white rounded-lg hover:bg-muted transition-colors cursor-pointer"
                  title="Clear Chat"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-text-secondary hover:text-white rounded-lg hover:bg-muted transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Suggested Chips (Chips scrollable at top of messages) */}
            <div className="px-4 py-2 border-b border-border/30 bg-card/40 flex gap-2 overflow-x-auto no-scrollbar shrink-0">
              {suggestedChips.map((chip) => (
                <button
                  key={chip}
                  onClick={() => handleSend(chip)}
                  className="px-2.5 py-1 bg-muted border border-border/50 hover:border-primary/50 text-[9px] font-bold text-text-secondary hover:text-white rounded-lg transition-all whitespace-nowrap cursor-pointer shrink-0"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Messages box */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
              {messages.map((m) => (
                <div 
                  key={m.id}
                  className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
                >
                  <div className="max-w-[85%] space-y-1">
                    {/* Timestamp & Sender */}
                    <span className="text-[8px] text-text-secondary/70 font-mono block px-1.5">
                      {m.sender === "ai" ? "AI Analyst" : "Investor"} • {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>

                    {/* Chat Bubble content */}
                    <div className={`p-3 rounded-2xl text-xs font-medium leading-relaxed relative group border ${
                      m.sender === "user"
                        ? "bg-primary text-white border-primary/20 rounded-tr-none"
                        : "bg-card border-border/60 text-text-secondary rounded-tl-none"
                    }`}>
                      {/* Markdown Parsing injection */}
                      <div 
                        dangerouslySetInnerHTML={{ __html: parseMarkdown(m.text) }}
                        className="space-y-1.5"
                      />

                      {/* Floating Copy Helper for Assistant */}
                      {m.sender === "ai" && (
                        <button
                          onClick={() => handleCopyMessage(m.text)}
                          className="absolute right-2 top-2 p-1 bg-muted border border-border/50 text-text-secondary hover:text-white rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          title="Copy message contents"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Spinner loader while generating */}
              {isTyping && (
                <div className="flex items-center gap-2 text-text-secondary text-[10px] pl-2 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce delay-100" />
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce delay-200" />
                  <span>AI is parsing report metrics...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
              className="p-3 border-t border-border/40 bg-card flex items-center gap-2 shrink-0"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask details (e.g. explain DCF)..."
                className="flex-1 px-3 py-2 text-xs bg-background border border-border/80 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-text-secondary/50"
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="p-2 bg-primary hover:bg-primary/95 text-white rounded-xl shadow transition-all cursor-pointer disabled:bg-muted disabled:text-text-secondary/40 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

          </div>
        </div>
      )}
    </>
  );
}
