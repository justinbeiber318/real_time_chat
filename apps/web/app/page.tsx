import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 text-white">
      <section className="w-full max-w-xl rounded-2xl border border-zinc-800 bg-zinc-900 p-8 text-center">
        <h1 className="text-3xl font-bold">Realtime Chat App</h1>

        <p className="mt-3 text-zinc-400">
          Next.js + Express + TypeScript + MySQL + Socket.IO
        </p>

        <div className="mt-8 flex justify-center gap-3">
          <Link
            href="/login"
            className="rounded-xl bg-white px-5 py-3 font-medium text-black"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="rounded-xl border border-zinc-700 px-5 py-3 font-medium text-white"
          >
            Register
          </Link>

          <Link
            href="/chat"
            className="rounded-xl border border-zinc-700 px-5 py-3 font-medium text-white"
          >
            Chat
          </Link>
        </div>
      </section>
    </main>
  );
}