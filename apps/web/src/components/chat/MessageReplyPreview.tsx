export function MessageReplyPreview({ content }: { content: string }) {
  return (
    <div className="rounded-2xl border-l-4 border-violet-400 bg-violet-50 px-4 py-2 text-xs font-semibold text-slate-500">
      {content}
    </div>
  );
}