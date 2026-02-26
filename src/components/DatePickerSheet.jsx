import { useEffect, useRef } from "react";
import { X } from "./Icons";
import { formatDate } from "../utils/formatters";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/**
 * Parses a raw date string like "1/5/25" into { month (1-12), year (4-digit) }.
 */
function parseMonthYear(dateStr) {
  const parts = dateStr.split(/[/\-.]/);
  if (parts.length !== 3) return null;

  let [p1, p2, p3] = parts.map(Number);
  let month, year;

  if (p1 > 12) {
    month = p2;
    year = p3;
  } else {
    month = p1;
    year = p3;
  }

  if (year < 100) year += year < 50 ? 2000 : 1900;
  return { month, year };
}

function getMonthLabel(dateStr) {
  const parsed = parseMonthYear(dateStr);
  if (!parsed) return "";
  return `${MONTH_NAMES[parsed.month - 1]} ${parsed.year}`;
}

function getMonthKey(dateStr) {
  const parsed = parseMonthYear(dateStr);
  if (!parsed) return dateStr;
  return `${parsed.year}-${String(parsed.month).padStart(2, "0")}`;
}

/**
 * Bottom-sheet date picker for jumping to a specific date in the chat.
 *
 * @param {{ dates: string[], onSelectDate: (date: string) => void, onClose: () => void }} props
 */
export default function DatePickerSheet({ dates, onSelectDate, onClose }) {
  const sheetRef = useRef(null);

  // Group dates by month
  const grouped = dates.reduce((acc, date) => {
    const key = getMonthKey(date);
    const label = getMonthLabel(date);
    if (!acc[key]) acc[key] = { label, dates: [] };
    acc[key].dates.push(date);
    return acc;
  }, {});

  const months = Object.keys(grouped).sort();

  // Close on backdrop click
  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) onClose();
  }

  // Close on Escape key
  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-30 flex items-end sm:items-center sm:justify-center bg-black/60 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div
        ref={sheetRef}
        className="w-full sm:max-w-sm bg-[#0f172a] rounded-t-3xl sm:rounded-2xl shadow-2xl ring-1 ring-slate-700/50 flex flex-col max-h-[72dvh] animate-slide-up"
      >
        {/* Handle bar (mobile) */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-slate-700" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800">
          <div>
            <h2 className="text-base font-semibold text-slate-200">
              Jump to Date
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {dates.length} days · {months.length} month
              {months.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Scrollable date list */}
        <div className="overflow-y-auto flex-1 px-4 py-3 space-y-4">
          {months.map((monthKey) => {
            const { label, dates: monthDates } = grouped[monthKey];
            return (
              <div key={monthKey}>
                {/* Month label */}
                <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-2 px-1">
                  {label}
                </p>

                {/* Date pills */}
                <div className="flex flex-wrap gap-2">
                  {monthDates.map((date) => (
                    <button
                      key={date}
                      onClick={() => onSelectDate(date)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-indigo-500/20 hover:ring-1 hover:ring-indigo-500/50 text-sm text-slate-300 hover:text-indigo-300 transition-all duration-150 cursor-pointer active:scale-95"
                    >
                      {formatDate(date)}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
