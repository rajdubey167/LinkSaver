// frontend/src/components/Navbar.tsx
"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [isClient, setIsClient] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setIsClient(true);
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      setLoggedIn(!!token);
      
      // Redirect to login if accessing protected routes without auth
      if (!token && (pathname === '/bookmarks')) {
        router.push('/auth/login');
      }
      
      // Redirect to bookmarks if accessing auth pages while logged in
      if (token && (pathname === '/auth/login' || pathname === '/auth/register')) {
        router.push('/bookmarks');
      }
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    router.push("/");
  };

  return (
    <nav className="sticky top-0 z-10 flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-500 text-base font-medium shadow-lg">
      <Link 
        href="/" 
        className="flex items-center gap-2 text-white text-4xl font-bold hover:scale-105 transition-transform"
      >
        <span role="img" aria-label="link emoji" className="text-3xl">🔗</span>
        <span className="bg-gradient-to-r from-white to-emerald-200 text-transparent bg-clip-text">
          LinkSaver
        </span>
      </Link>
      <div className="flex gap-3 ml-8">
        <Link 
          href="/" 
          className={`flex items-center gap-2 !text-white font-bold px-4 py-1.5 rounded-md hover:bg-gradient-to-r hover:from-emerald-500/40 hover:to-teal-400/40 transition-all ${
            pathname === "/" ? "bg-gradient-to-r from-emerald-500/30 to-teal-400/30" : ""
          }`}
        >
          <span role="img" aria-label="home emoji" className="text-lg">🏠</span>
          Home
        </Link>
        {isClient && loggedIn && (
          <Link 
            href="/bookmarks" 
            className={`flex items-center gap-2 !text-white font-bold px-4 py-1.5 rounded-md hover:bg-gradient-to-r hover:from-emerald-500/40 hover:to-teal-400/40 transition-all ${
              pathname === "/bookmarks" ? "bg-gradient-to-r from-emerald-500/30 to-teal-400/30" : ""
            }`}
          >
            <span role="img" aria-label="bookmark emoji" className="text-lg">📚</span>
            Bookmarks
          </Link>
        )}
      </div>
      <div className="ml-auto flex gap-3">
        {isClient && (loggedIn ? (
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-2 rounded-md font-semibold !text-white border-2 border-white/20 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 shadow-sm transition-all"
          >
            <span role="img" aria-label="logout emoji" className="text-lg">👋</span>
            Logout
          </button>
        ) : (
          <>
            <Link 
              href="/auth/login" 
              className="flex items-center gap-2 px-5 py-2 rounded-md font-semibold !text-white border-2 border-white/20 bg-gradient-to-r from-emerald-500/20 to-teal-400/20 hover:from-emerald-500/40 hover:to-teal-400/40 transition-all"
            >
              <span role="img" aria-label="login emoji" className="text-lg">🔑</span>
              Login
            </Link>
            <Link 
              href="/auth/register" 
              className="flex items-center gap-2 px-5 py-2 rounded-md font-semibold !text-white border-2 border-white/20 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 shadow-sm transition-all"
            >
              <span role="img" aria-label="register emoji" className="text-lg">✨</span>
              Register
            </Link>
          </>
        ))}
      </div>
    </nav>
  );
}