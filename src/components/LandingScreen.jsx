import { MessageSquareText, ArrowRight } from "./Icons";

/**
 * Landing screen — the first thing users see.
 * Shows app branding and a CTA to get started.
 */
export default function LandingScreen({ onGetStarted }) {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center bg-linear-to-br from-[#070d1a] via-[#0f172a] to-[#1e1b4b] px-4">
      {/* Floating decorative circles */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-indigo-500/8 rounded-full blur-2xl" />
      <div className="absolute bottom-20 right-10 w-48 h-48 bg-violet-500/8 rounded-full blur-3xl" />
      <div className="absolute top-1/3 right-1/4 w-40 h-40 bg-cyan-500/5 rounded-full blur-3xl" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-md">
        {/* Logo */}
        <div className="w-20 h-20 bg-indigo-500/15 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 shadow-lg ring-1 ring-indigo-400/20">
          <MessageSquareText className="w-10 h-10 text-indigo-300" />
        </div>

        {/* App Name */}
        <h1 className="text-6xl font-bold text-white tracking-tight mb-3 bg-linear-to-r from-indigo-300 via-violet-300 to-cyan-300 bg-clip-text">
          Woogle
        </h1>

        {/* Tagline */}
        <p className="text-slate-300 text-xl mb-2 mt-10">
          Lost your WhatsApp chats ?
        </p>
        <p className="text-slate-500 text-base mb-10 max-w-xs">
          Upload your exported WhatsApp chat file and relive your conversations
          in a clean, familiar interface.
        </p>

        {/* CTA Button */}
        <button
          onClick={onGetStarted}
          className="group flex items-center gap-2 bg-indigo-500 text-white font-semibold text-xl px-8 py-3.5 rounded-full shadow-xl shadow-indigo-500/25 hover:bg-indigo-400 hover:shadow-2xl hover:shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
        >
          Get Started
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Footer */}
      <p className="absolute bottom-6 left-0 right-0 text-center text-slate-400 text-sm px-4">
        Privacy • Your files are processed locally • Nothing is uploaded to any
        server.
      </p>
    </div>
  );
}
