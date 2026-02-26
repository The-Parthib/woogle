import { formatTime } from "../utils/formatters";

/**
 * Individual chat bubble — styled differently for sent (owner) vs received messages.
 * In group chats, shows the sender name for received messages.
 *
 * @param {{ sender: string, message: string, time: string, isOwner: boolean, showSender: boolean, senderColor: string }} props
 */
export default function ChatBubble({
  sender,
  message,
  time,
  isOwner,
  showSender = false,
  senderColor = "#818cf8",
}) {
  return (
    <div
      className={`flex ${isOwner ? "justify-end" : "justify-start"} mb-1 px-2 sm:px-4`}
    >
      <div
        className={`
          relative max-w-[80%] sm:max-w-[65%] rounded-lg px-3 py-1.5 shadow-sm
          ${
            isOwner
              ? "bg-indigo-500/15 ring-1 ring-indigo-500/20 rounded-tr-none"
              : "bg-[#1e293b] ring-1 ring-slate-700/50 rounded-tl-none"
          }
        `}
      >
        {/* Sender name (group chats, received messages only) */}
        {showSender && !isOwner && sender && (
          <p
            className="text-xs font-semibold mb-0.5 truncate"
            style={{ color: senderColor }}
          >
            {sender}
          </p>
        )}

        {/* Message body */}
        <div className="flex items-end gap-2">
          <p className="text-[14.5px] text-slate-200 whitespace-pre-wrap break-words min-w-0 leading-[19px]">
            {message}
          </p>

          {/* Timestamp */}
          <span className="text-[11px] text-slate-500 whitespace-nowrap self-end shrink-0 relative top-[3px] ml-1">
            {formatTime(time)}
          </span>
        </div>
      </div>
    </div>
  );
}
