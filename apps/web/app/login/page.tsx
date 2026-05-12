"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import type { AuthResponse } from "@/types/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    console.log("LOGIN SUBMIT");

    setError("");
    setIsLoading(true);

    try {
      const result = await apiFetch<AuthResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      console.log("LOGIN RESULT:", result);

      const accessToken = result.data.accessToken;

      if (!accessToken) {
        throw new Error("Backend did not return accessToken");
      }

      localStorage.setItem("accessToken", accessToken);

      console.log("SAVED TOKEN:", localStorage.getItem("accessToken"));

      window.location.href = "/chat";
    } catch (error) {
      console.error("LOGIN ERROR:", error);
      setError(error instanceof Error ? error.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 text-white">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-6"
      >
        <h1 className="text-2xl font-bold">Welcome back</h1>

        <p className="mt-2 text-sm text-zinc-400">
          Đăng nhập để tiếp tục chat.
        </p>

        {error ? (
          <div className="mt-4 rounded-xl border border-red-800 bg-red-950 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        ) : null}

        <div className="mt-6 space-y-4">
          <div>
            <label className="text-sm text-zinc-300">Email</label>
            <input
              className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-zinc-400"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              type="email"
              autoComplete="email"
            />
          </div>

          <div>
            <label className="text-sm text-zinc-300">Password</label>
            <input
              className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-zinc-400"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Your password"
              type="password"
              autoComplete="current-password"
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 w-full rounded-xl bg-white px-4 py-3 font-medium text-black disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>

        <p className="mt-4 text-center text-sm text-zinc-400">
          No account yet?{" "}
          <Link className="text-white underline" href="/register">
            Register
          </Link>
        </p>
      </form>
    </main>
  );
}