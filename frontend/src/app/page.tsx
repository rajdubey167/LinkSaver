"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
    const handler = () => setIsLoggedIn(!!localStorage.getItem("token"));
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  return (
    <div>
      <div style={{
        minHeight: "100vh",
        width: "100vw",
        background: "linear-gradient(135deg, #18181b 0%, #23232b 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: 'Inter, Arial, sans-serif',
        color: "#ededed",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Animated SVG Background - Fullscreen, Dense */}
        <svg
          width="100vw"
          height="100vh"
          viewBox="0 0 1920 1080"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 0,
            pointerEvents: "none",
            opacity: 0.55,
            filter: "blur(0.5px)",
            animation: "floatBG 18s ease-in-out infinite alternate"
          }}
        >
          {/* Many Nodes */}
          {[...Array(24)].map((_, i) => {
            // Randomized positions, radii, and colors for variety
            const cx = 120 + (i % 6) * 300 + (i % 2 === 0 ? 40 : -40);
            const cy = 120 + Math.floor(i / 6) * 250 + (i % 3) * 30;
            const r = 14 + (i % 5) * 6;
            const color = ["#60a5fa","#2563eb","#fbbf24","#a3e635"][i % 4];
            const opacity = 0.13 + (i % 4) * 0.05;
            const dur = 6 + (i % 7) * 1.2;
            return (
              <circle key={i} cx={cx} cy={cy} r={r} fill={color} fillOpacity={opacity}>
                <animate attributeName="cy" values={`${cy};${cy+20};${cy}`} dur={`${dur}s`} repeatCount="indefinite" />
              </circle>
            );
          })}
          {/* Many Interconnecting Lines */}
          {[...Array(18)].map((_, i) => {
            const x1 = 120 + (i % 6) * 300;
            const y1 = 120 + Math.floor(i / 6) * 250;
            const x2 = 120 + ((i+2) % 6) * 300;
            const y2 = 120 + Math.floor((i+2) / 6) * 250;
            const color = ["#60a5fa","#2563eb","#fbbf24","#a3e635"][i % 4];
            const dash = 5 + (i % 4) * 3;
            const opacity = 0.11 + (i % 4) * 0.04;
            return (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="2" strokeDasharray={`${dash} ${dash+3}`} opacity={opacity} />
            );
          })}
          {/* Many Subtle Icons */}
          {[...Array(12)].map((_, i) => {
            const x = 100 + (i % 6) * 300;
            const y = 100 + Math.floor(i / 6) * 250;
            const w = 18 + (i % 3) * 10;
            const h = 9 + (i % 2) * 6;
            const color = ["#60a5fa","#fbbf24","#a3e635","#2563eb"][i % 4];
            const opacity = 0.10 + (i % 4) * 0.04;
            return (
              <rect key={i} x={x} y={y} width={w} height={h} rx="2" fill={color} fillOpacity={opacity} />
            );
          })}
          {/* Many Tag/Ellipse shapes */}
          {[...Array(10)].map((_, i) => {
            const cx = 200 + (i % 5) * 350;
            const cy = 200 + Math.floor(i / 5) * 400;
            const rx = 8 + (i % 3) * 4;
            const ry = 4 + (i % 2) * 2;
            const color = ["#60a5fa","#2563eb","#fbbf24","#a3e635"][i % 4];
            const opacity = 0.09 + (i % 4) * 0.04;
            return (
              <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry} fill={color} fillOpacity={opacity} />
            );
          })}
        </svg>
        {/* Background Pattern */}
        <div style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(45, 138, 78, 0.15) 1px, transparent 0)",
          backgroundSize: "30px 30px",
          opacity: 0.5,
          pointerEvents: "none",
        }} />
        
        <div style={{
          background: "linear-gradient(to bottom right, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.95))",
          backdropFilter: "blur(10px)",
          borderRadius: "24px",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1), inset 0 -3px 0 rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(0, 128, 0, 0.1)",
          padding: "48px 40px",
          maxWidth: 420,
          width: "100%",
          margin: 16,
          border: "1px solid rgba(0, 128, 0, 0.1)",
          textAlign: "center",
          color: "#222",
          position: "relative",
          zIndex: 1,
        }}>
          {/* Card Border Gradient */}
          <div style={{
            position: "absolute",
            top: -2,
            left: -2,
            right: -2,
            bottom: -2,
            background: "linear-gradient(135deg, rgba(0, 128, 0, 0.2), rgba(0, 128, 0, 0.1))",
            borderRadius: "26px",
            zIndex: -1,
          }} />

          <h1 style={{ 
            fontSize: 32, 
            marginBottom: 10, 
            fontWeight: 700, 
            color: "#111111",
            textShadow: "1px 1px 0 rgba(255, 255, 255, 0.5)"
          }}>
            Link Saver <span style={{ 
              background: "linear-gradient(120deg, #2d8a4e, #1a472a)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              padding: "0 4px"
            }}>+ Auto-Summary</span>
          </h1>
          <p style={{ 
            fontSize: 17, 
            marginBottom: 32, 
            color: "#111111", 
            fontWeight: 400,
            lineHeight: 1.6
          }}>
            {isLoggedIn 
              ? "Welcome back! Manage your bookmarks and discover new insights."
              : "Save your important links and get AI-powered summaries. Secure, fast, and beautiful."
            }
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 8, flexWrap: 'wrap' }}>
            {isLoggedIn ? (
              <Link href="/bookmarks">
                <button style={{
                  padding: "14px 32px",
                  borderRadius: 12,
                  background: "linear-gradient(135deg, #2d8a4e, #1a472a)",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: 16,
                  border: "none",
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(45, 138, 78, 0.2), inset 0 -2px 0 rgba(0, 0, 0, 0.1)",
                  transition: "all 0.3s ease",
                  transform: "translateY(0)",
                }}>
                  Go to My Bookmarks
                </button>
              </Link>
            ) : (
              <>
                <Link href="/auth/register">
                  <button style={{
                    padding: "14px 32px",
                    borderRadius: 12,
                    background: "linear-gradient(135deg, #2d8a4e, #1a472a)",
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: 16,
                    border: "none",
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(45, 138, 78, 0.2), inset 0 -2px 0 rgba(0, 0, 0, 0.1)",
                    transition: "all 0.3s ease",
                    transform: "translateY(0)",
                  }}>
                    Get Started
                  </button>
                </Link>
                <Link href="/auth/login">
                  <button style={{
                    padding: "14px 32px",
                    borderRadius: 12,
                    background: "rgba(255, 255, 255, 0.8)",
                    color: "#2d8a4e",
                    fontWeight: 600,
                    fontSize: 16,
                    border: "2px solid #2d8a4e",
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(45, 138, 78, 0.1)",
                    transition: "all 0.3s ease",
                    transform: "translateY(0)",
                  }}>
                    Login
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Only show features section for non-logged in users */}
      {!isLoggedIn && (
        <div className="bg-gradient-to-br from-gray-50 to-green-50 py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Smart Summaries for Better Bookmarking
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Writing Summary Card */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 shadow-sm border border-green-100">
                <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
                  <Image
                    src="https://www.noslangues-ourlanguages.gc.ca/sites/default/files/secrets-du-resume-writing-a-summary_376x250.png"
                    alt="Writing Summary"
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Automated Summary Generation</h3>
                <p className="text-gray-900">
                  Our AI-powered system automatically generates concise summaries of your saved articles, 
                  helping you quickly recall the content without revisiting the full page.
                </p>
              </div>

              {/* Visual Summary Card */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 shadow-sm border border-green-100">
                <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
                  <Image
                    src="https://i.pinimg.com/736x/27/d2/b9/27d2b9690a56758adfa5c410e0c43b4e.jpg"
                    alt="Visual Summary"
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Visual Organization</h3>
                <p className="text-gray-900">
                  Organize your bookmarks with visual cues and tags, making it easier to find and 
                  manage your saved content through an intuitive interface.
                </p>
              </div>

              {/* Executive Summary Card */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 shadow-sm border border-green-100">
                <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
                  <Image
                    src="https://cdn.prod.website-files.com/6253f6e60f27498e7d4a1e46/62fe53bd5c607a62a847c7f4_Why%20your%20business%20plan_s%20executive%20summary%20is%20so%20important-p-1600.webp"
                    alt="Executive Summary"
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Insights</h3>
                <p className="text-gray-900">
                  Get key insights and main points from your saved content, helping you make better 
                  decisions and stay informed without information overload.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      <style jsx global>{`
        @keyframes floatBG {
          0% { transform: translateY(0); }
          100% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
}
