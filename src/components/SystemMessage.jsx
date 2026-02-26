/**
 * System message — centered, muted text for WhatsApp system events.
 * e.g., "Messages and calls are end-to-end encrypted", "X added Y"
 *
 * @param {{ message: string }} props
 */
export default function SystemMessage({ message }) {
  return (
    <div className="flex justify-center my-2 px-4">
      <span className="bg-amber-500/10 text-amber-300/70 text-xs text-center italic px-3 py-1.5 rounded-lg shadow-sm ring-1 ring-amber-500/15 max-w-[85%] sm:max-w-[70%]">
        {message}
      </span>
    </div>
  );
}
