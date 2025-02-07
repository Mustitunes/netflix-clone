import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import "../styles/globals.css";
import Loading from "../components/loading/loading";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return; // ✅ Stelle sicher, dass der Code nur im Client läuft
    if (sessionStorage.getItem("alreadyRedirected")) return;
    sessionStorage.setItem("alreadyRedirected", "true");

    // `magic` erst hier importieren, wenn der Code sicher im Browser läuft
    import("../lib/magic-client").then(({ magic }) => {
      const handleLoggedIn = async () => {
        const isLoggedIn = await magic.user.isLoggedIn();
        router.push(isLoggedIn ? "/" : "/login");
      };

      handleLoggedIn();
    });
  }, [router]);

  useEffect(() => {
    const handleComplete = () => {
      setIsLoading(false);
    };
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);

  return isLoading ? <Loading /> : <Component {...pageProps} />;
}

export default MyApp;
