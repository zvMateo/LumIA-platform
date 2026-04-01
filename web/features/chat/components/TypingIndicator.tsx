export function TypingIndicator() {
  return (
    <div className="flex gap-2 flex-row">
      <div className="shrink-0 w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-white text-sm font-bold">
        V
      </div>
      <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
        <span className="w-2 h-2 rounded-full bg-gray-400 animate-[pulse-dot_1.2s_ease-in-out_infinite]" />
        <span className="w-2 h-2 rounded-full bg-gray-400 animate-[pulse-dot_1.2s_ease-in-out_0.2s_infinite]" />
        <span className="w-2 h-2 rounded-full bg-gray-400 animate-[pulse-dot_1.2s_ease-in-out_0.4s_infinite]" />
      </div>
    </div>
  );
}
