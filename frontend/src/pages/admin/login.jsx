import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { FiLock, FiMail } from "react-icons/fi";
import Logo from "@/components/Logo";
import api from "@/utils/api";
import { setSession } from "@/utils/adminAuth";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      setSession(data);
      router.replace("/admin");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Unable to sign in. Check your credentials or connection.",
      );
    } finally {
      setLoading(false);
    }
  };

  const field =
    "w-full rounded-lg border border-slate-300 bg-white py-2.5 pe-3 ps-10 text-slate-800 outline-none transition-colors focus:border-rust focus:ring-2 focus:ring-rust/20";

  return (
    <>
      <Head>
        <title>Admin Login | Mio</title>
        <meta name="robots" content="noindex" />
      </Head>
      <div dir="ltr" className="grid min-h-screen place-items-center bg-[#2A211C] p-4">
        <form
          onSubmit={submit}
          className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl ring-1 ring-black/5"
        >
          <Logo variant="rust" height={40} priority />
          <p className="mt-4 text-sm font-semibold uppercase tracking-widest text-rust">
            Admin
          </p>
          <p className="mt-1 text-sm text-[#8A7C6E]">Sign in to manage your restaurant.</p>

          {error && (
            <div className="mt-5 rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-700">
              {error}
            </div>
          )}

          <label className="mt-6 block text-sm font-medium text-slate-700">Email</label>
          <div className="relative mt-1">
            <FiMail className="absolute inset-y-0 start-3 my-auto text-slate-400" />
            <input
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={field}
              placeholder="admin@miopizzeria.qa"
            />
          </div>

          <label className="mt-4 block text-sm font-medium text-slate-700">Password</label>
          <div className="relative mt-1">
            <FiLock className="absolute inset-y-0 start-3 my-auto text-slate-400" />
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={field}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-lg bg-rust py-2.5 font-semibold text-white transition-colors hover:bg-rust-dark disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </>
  );
}
