import { useState, useRef } from "react";
import { getFileSizeString } from "../utils/formatters";
import { Upload, FileText, X, ArrowLeft, Loader } from "./Icons";

/**
 * File upload screen with drag-and-drop and click-to-upload.
 * Accepts only .txt files (WhatsApp chat exports).
 */
export default function FileUpload({ onFileSubmit, onBack }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);

  function validateAndSetFile(selectedFile) {
    setError("");

    if (!selectedFile) return;

    if (!selectedFile.name.toLowerCase().endsWith(".txt")) {
      setError("Please upload a .txt file exported from WhatsApp.");
      setFile(null);
      return;
    }

    if (selectedFile.size === 0) {
      setError("The file appears to be empty.");
      setFile(null);
      return;
    }

    setFile(selectedFile);
  }

  function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }

  function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }

  function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files?.[0];
    validateAndSetFile(droppedFile);
  }

  function handleFileSelect(e) {
    const selectedFile = e.target.files?.[0];
    validateAndSetFile(selectedFile);
  }

  function handleRemoveFile() {
    setFile(null);
    setError("");
    if (inputRef.current) inputRef.current.value = "";
  }

  async function handleSubmit() {
    if (!file) return;

    setIsLoading(true);
    setError("");

    try {
      const text = await file.text();

      if (!text.trim()) {
        setError("The file appears to be empty.");
        setIsLoading(false);
        return;
      }

      // Small delay so the spinner is perceivable
      onFileSubmit(text);
    } catch {
      setError("Failed to read the file. Please try again.");
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-dvh bg-[#070d1a] flex flex-col">
      {/* Header */}
      <header className="bg-[#0f172a] text-white px-4 py-3 flex items-center gap-3 shadow-md border-b border-slate-800">
        <button
          onClick={onBack}
          className="p-1.5 -ml-1.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-semibold">Upload Chat</h1>
      </header>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Instructions */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-slate-200 mb-3">
              Upload your chat export
            </h2>
            <div className="inline-flex flex-col items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl px-5 py-3">
              <p className="text-xs font-semibold text-amber-400 uppercase tracking-widest">
                How to export
              </p>
              <p className="text-base text-amber-200/90 font-medium leading-relaxed">
                WhatsApp → Chat → Export Chat → Without Media → save the{" "}
                <span className="font-bold text-amber-300">.txt</span> file
              </p>
            </div>
            <p className="text-sm text-green-500 m-4">
              Don't have the file? Ask the other person to export and share it
              with you.
            </p>
          </div>

          {/* Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !file && inputRef.current?.click()}
            className={`
              relative rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-200
              ${
                isDragging
                  ? "border-indigo-500 bg-indigo-500/10 scale-[1.02]"
                  : file
                    ? "border-indigo-500/50 bg-[#1e293b]"
                    : "border-slate-700 bg-[#1e293b] hover:border-indigo-500/50 hover:bg-[#1e293b]/80 cursor-pointer"
              }
            `}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".txt"
              onChange={handleFileSelect}
              className="hidden"
            />

            {!file ? (
              <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-indigo-500/15 flex items-center justify-center">
                  <Upload className="w-7 h-7 text-indigo-400" />
                </div>
                <div>
                  <p className="font-medium text-slate-300">
                    Drag & drop your file here
                  </p>
                  <p className="text-sm text-slate-500 mt-1">
                    or click to browse (.txt only)
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/15 flex items-center justify-center shrink-0">
                  <FileText className="w-6 h-6 text-indigo-400" />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="font-medium text-slate-200 truncate">
                    {file.name}
                  </p>
                  <p className="text-sm text-slate-500">
                    {getFileSizeString(file.size)}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile();
                  }}
                  className="p-1.5 rounded-full hover:bg-slate-700 transition-colors cursor-pointer"
                  aria-label="Remove file"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
            )}
          </div>

          {/* Error message */}
          {error && (
            <div className="mt-3 px-4 py-2.5 bg-red-500/10 border border-red-500/30 rounded-xl text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Submit button */}
          <button
            onClick={handleSubmit}
            disabled={!file || isLoading}
            className={`
              mt-6 w-full py-3.5 rounded-full font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-2
              ${
                file && !isLoading
                  ? "bg-indigo-500 text-white hover:bg-indigo-400 active:scale-[0.98] shadow-lg shadow-indigo-500/25 cursor-pointer"
                  : "bg-slate-800 text-slate-600 cursor-not-allowed"
              }
            `}
          >
            {isLoading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Parsing chat...
              </>
            ) : (
              "View Chat"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
