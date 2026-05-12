export function EmptyChatState() {
  return (
    <div className="grid h-full place-items-center text-center">
      <div>
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-[28px] bg-violet-100 text-3xl">
          💬
        </div>

        <h2 className="mt-4 text-xl font-black text-slate-950">
          Select a chat
        </h2>

        <p className="mt-2 text-sm font-medium text-slate-500">
          Choose a conversation to start messaging.
        </p>
      </div>
    </div>
  );
}