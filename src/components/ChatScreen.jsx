import { useRef, useEffect, useState, useMemo, useCallback } from "react";
import ChatBubble from "./ChatBubble";
import DateSeparator from "./DateSeparator";
import SystemMessage from "./SystemMessage";
import DatePickerSheet from "./DatePickerSheet";
import ChatSkeleton from "./ChatSkeleton";
import { ArrowLeft, Users, ChevronDown, ChevronUp, Calendar } from "./Icons";

/**
 * Color palette for sender names in group chats.
 */
const SENDER_COLORS = [
  "#a5b4fc",
  "#f9a8d4",
  "#c4b5fd",
  "#6ee7b7",
  "#93c5fd",
  "#67e8f9",
  "#fcd34d",
  "#fdba74",
  "#cbd5e1",
  "#d8b4fe",
];

/**
 * Assigns a persistent color to each sender based on their name.
 */
function getSenderColor(sender, colorMap) {
  if (!colorMap.current[sender]) {
    const idx = Object.keys(colorMap.current).length % SENDER_COLORS.length;
    colorMap.current[sender] = SENDER_COLORS[idx];
  }
  return colorMap.current[sender];
}

/**
 * Main chat viewing screen — WhatsApp-like message interface.
 */
export default function ChatScreen({ chatData, onBack }) {
  const { messages, participants, chatName, owner } = chatData;
  const messagesStartRef = useRef(null);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const senderColorMap = useRef({});
  const dateRefs = useRef({});
  const [showScrollDown, setShowScrollDown] = useState(false);
  const [showScrollUp, setShowScrollUp] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isJumping, setIsJumping] = useState(false);

  // Unique ordered dates from messages
  const uniqueDates = useMemo(() => {
    const seen = new Set();
    const result = [];
    for (const msg of messages) {
      if (msg.date && !seen.has(msg.date)) {
        seen.add(msg.date);
        result.push(msg.date);
      }
    }
    return result;
  }, [messages]);

  const isGroupChat = participants.length > 2;

  // Build the rendered message list with date separators injected
  const renderedItems = useMemo(() => {
    const items = [];
    let lastDate = null;

    for (const msg of messages) {
      if (msg.date !== lastDate) {
        items.push({
          type: "date-separator",
          date: msg.date,
          id: `date-${msg.id}`,
        });
        lastDate = msg.date;
      }
      items.push(msg);
    }

    return items;
  }, [messages]);

  // Start at the top (beginning of chat) on initial render
  useEffect(() => {
    chatContainerRef.current?.scrollTo(0, 0);
  }, []);

  // Track scroll position to show/hide scroll buttons
  const handleScroll = useCallback(() => {
    const el = chatContainerRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    const distanceFromTop = el.scrollTop;
    setShowScrollDown(distanceFromBottom > 300);
    setShowScrollUp(distanceFromTop > 300);
  }, []);

  function scrollToTop() {
    messagesStartRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  function jumpToDate(date) {
    setShowDatePicker(false);
    setIsJumping(true);

    setTimeout(() => {
      const targetEl = dateRefs.current[date];
      const containerEl = chatContainerRef.current;
      if (targetEl && containerEl) {
        // getBoundingClientRect is relative to the viewport and works
        // regardless of offsetParent chain — avoids the header-height offset bug.
        const containerTop = containerEl.getBoundingClientRect().top;
        const targetTop = targetEl.getBoundingClientRect().top;
        containerEl.scrollTop += targetTop - containerTop;
      }
      setIsJumping(false);
    }, 320);
  }

  return (
    <div className="h-dvh flex flex-col bg-[#0b1120] relative">
      {/* Header */}
      <header className="bg-[#0f172a] text-white px-2 sm:px-4 py-2.5 flex items-center gap-2 sm:gap-3 shadow-md border-b border-slate-800 z-10 shrink-0">
        <button
          onClick={onBack}
          className="p-1.5 -ml-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
          <Users className="w-5 h-5 text-indigo-300" />
        </div>

        <div className="min-w-0 flex-1">
          <h1 className="text-base font-semibold truncate leading-tight">
            {chatName}
          </h1>
          <p className="text-xs text-slate-400 truncate leading-tight">
            {isGroupChat ? `${participants.length} participants` : "Memories"}
          </p>
        </div>

        {/* Message count badge */}
        <div className="text-xs text-indigo-300/70 bg-indigo-500/10 px-2 py-1 rounded-full hidden sm:block">
          {messages.filter((m) => m.type === "message").length} messages
        </div>

        {/* Jump to date */}
        <button
          onClick={() => setShowDatePicker(true)}
          className="p-1.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="Jump to date"
          title="Jump to date"
        >
          <Calendar className="w-5 h-5 text-slate-300" />
        </button>
      </header>

      {/* Chat wallpaper + messages */}
      <div
        ref={chatContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto chat-wallpaper relative"
      >
        <div className="max-w-3xl mx-auto py-2">
          <div ref={messagesStartRef} />
          {renderedItems.map((item) => {
            if (item.type === "date-separator") {
              return (
                <div
                  key={item.id}
                  ref={(el) => {
                    dateRefs.current[item.date] = el;
                  }}
                >
                  <DateSeparator date={item.date} />
                </div>
              );
            }

            if (item.type === "system") {
              return <SystemMessage key={item.id} message={item.message} />;
            }

            return (
              <ChatBubble
                key={item.id}
                sender={item.sender}
                message={item.message}
                time={item.time}
                isOwner={item.isOwner}
                showSender={isGroupChat}
                senderColor={getSenderColor(item.sender, senderColorMap)}
              />
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Scroll FABs */}
      <div className="absolute bottom-6 right-4 sm:right-6 flex flex-col gap-2 z-20">
        {showScrollUp && (
          <button
            onClick={scrollToTop}
            className="w-10 h-10 bg-[#1e293b] rounded-full shadow-lg ring-1 ring-slate-700 flex items-center justify-center hover:bg-[#334155] active:scale-90 transition-all cursor-pointer"
            aria-label="Scroll to top"
          >
            <ChevronUp className="w-5 h-5 text-slate-300" />
          </button>
        )}
        {showScrollDown && (
          <button
            onClick={scrollToBottom}
            className="w-10 h-10 bg-[#1e293b] rounded-full shadow-lg ring-1 ring-slate-700 flex items-center justify-center hover:bg-[#334155] active:scale-90 transition-all cursor-pointer"
            aria-label="Scroll to bottom"
          >
            <ChevronDown className="w-5 h-5 text-slate-300" />
          </button>
        )}
      </div>

      {/* Date picker bottom sheet */}
      {showDatePicker && (
        <DatePickerSheet
          dates={uniqueDates}
          onSelectDate={jumpToDate}
          onClose={() => setShowDatePicker(false)}
        />
      )}

      {/* Jump overlay — skeleton on top, real chat stays mounted so refs work */}
      {isJumping && (
        <div className="absolute inset-0 z-40">
          <ChatSkeleton />
        </div>
      )}
    </div>
  );
}
