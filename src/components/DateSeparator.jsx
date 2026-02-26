import { formatDate } from "../utils/formatters";

/**
 * Date separator pill shown between messages from different days.
 *
 * @param {{ date: string }} props
 */
export default function DateSeparator({ date }) {
  return (
    <div className="flex justify-center my-3 px-4">
      <span className="bg-[#1e293b] text-indigo-300/80 text-xs font-medium px-3 py-1 rounded-lg shadow-sm ring-1 ring-slate-700/50">
        {formatDate(date)}
      </span>
    </div>
  );
}
