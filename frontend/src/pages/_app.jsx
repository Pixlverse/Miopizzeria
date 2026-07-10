import "@/styles/globals.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { AnimatePresence } from "framer-motion";
import PizzaLoader from "@/components/PizzaLoader";

// Minimum time (ms) the pizza loader stays on screen per navigation.
const MIN_LOADER_MS = 2000;

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // Initial site load.
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), MIN_LOADER_MS);
    return () => clearTimeout(t);
  }, []);

  // Subsequent route changes — show loader for at least MIN_LOADER_MS.
  useEffect(() => {
    let timer;
    let startedAt = 0;

    const onStart = () => {
      startedAt = Date.now();
      setLoading(true);
    };
    const onDone = () => {
      const elapsed = Date.now() - startedAt;
      timer = setTimeout(
        () => setLoading(false),
        Math.max(0, MIN_LOADER_MS - elapsed),
      );
    };

    router.events.on("routeChangeStart", onStart);
    router.events.on("routeChangeComplete", onDone);
    router.events.on("routeChangeError", onDone);

    return () => {
      router.events.off("routeChangeStart", onStart);
      router.events.off("routeChangeComplete", onDone);
      router.events.off("routeChangeError", onDone);
      clearTimeout(timer);
    };
  }, [router.events]);

  return (
    <>
      <AnimatePresence>
        {loading && <PizzaLoader key="pizza-loader" />}
      </AnimatePresence>
      <Component {...pageProps} />
    </>
  );
}
