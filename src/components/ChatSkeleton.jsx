/**
 * Skeleton placeholder for the chat screen.
 * Shown while the chat file is being parsed.
 * Mimics the exact layout of ChatScreen with shimmer animation.
 */

function SkeletonLine({ width = "w-full", height = "h-3" }) {
  return (
    <div
      className={`${width} ${height} bg-slate-800 rounded-full skeleton-shimmer`}
    />
  );
}

function SkeletonBubble({ isOwner = false, lines = 2, wide = false }) {
  const widths = ["w-full", "w-4/5", "w-3/5", "w-2/3", "w-1/2", "w-3/4"];
  return (
    <div
      className={`flex ${isOwner ? "justify-end" : "justify-start"} mb-3 px-4`}
    >
      <div
        className={`
          flex flex-col gap-2 rounded-xl px-4 py-3
          ${wide ? "w-[55%] sm:w-[40%]" : "w-[42%] sm:w-[32%]"}
          ${isOwner ? "bg-indigo-500/8 rounded-tr-none" : "bg-slate-800/60 rounded-tl-none"}
          skeleton-shimmer
        `}
      >
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={`h-2.5 bg-slate-700/60 rounded-full ${i === lines - 1 ? widths[(i * 3) % widths.length] : "w-full"}`}
          />
        ))}
        {/* Timestamp placeholder */}
        <div className="flex justify-end">
          <div className="h-2 w-10 bg-slate-700/40 rounded-full" />
        </div>
      </div>
    </div>
  );
}

function SkeletonDateSeparator() {
  return (
    <div className="flex justify-center my-4 px-4">
      <div className="h-5 w-28 bg-slate-800 rounded-lg skeleton-shimmer" />
    </div>
  );
}

const BUBBLE_PATTERN = [
  { isOwner: false, lines: 1, wide: false },
  { isOwner: true, lines: 2, wide: true },
  { isOwner: false, lines: 3, wide: true },
  { isOwner: true, lines: 1, wide: false },
  { isOwner: false, lines: 2, wide: false },
  { isOwner: true, lines: 2, wide: true },
  { isOwner: false, lines: 1, wide: true },
  { isOwner: true, lines: 3, wide: false },
  { isOwner: false, lines: 2, wide: true },
  { isOwner: true, lines: 1, wide: false },
  { isOwner: false, lines: 1, wide: true },
  { isOwner: true, lines: 2, wide: true },
];

export default function ChatSkeleton() {
  return (
    <div className="h-dvh flex flex-col bg-[#0b1120]">
      {/* Header skeleton */}
      <header className="bg-[#0f172a] px-4 py-3 flex items-center gap-3 border-b border-slate-800 shrink-0">
        {/* Back button */}
        <div className="w-8 h-8 rounded-full bg-slate-800 skeleton-shimmer shrink-0" />

        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-slate-800 skeleton-shimmer shrink-0" />

        {/* Name + subtitle */}
        <div className="flex-1 flex flex-col gap-1.5 min-w-0">
          <div className="h-3.5 w-32 bg-slate-700 rounded-full skeleton-shimmer" />
          <div className="h-2.5 w-20 bg-slate-800 rounded-full skeleton-shimmer" />
        </div>

        {/* Badge */}
        <div className="hidden sm:block h-6 w-20 bg-slate-800 rounded-full skeleton-shimmer" />

        {/* Calendar icon */}
        <div className="w-8 h-8 rounded-full bg-slate-800 skeleton-shimmer shrink-0" />
      </header>

      {/* Chat body skeleton */}
      <div className="flex-1 overflow-hidden chat-wallpaper relative">
        <div className="max-w-3xl mx-auto py-3">
          <SkeletonDateSeparator />

          {BUBBLE_PATTERN.slice(0, 5).map((p, i) => (
            <SkeletonBubble key={i} {...p} />
          ))}

          <SkeletonDateSeparator />

          {BUBBLE_PATTERN.slice(5, 9).map((p, i) => (
            <SkeletonBubble key={i + 5} {...p} />
          ))}

          <SkeletonDateSeparator />

          {BUBBLE_PATTERN.slice(9).map((p, i) => (
            <SkeletonBubble key={i + 9} {...p} />
          ))}
        </div>
      </div>
    </div>
  );
}
