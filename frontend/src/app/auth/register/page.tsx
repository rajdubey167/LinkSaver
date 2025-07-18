"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: ""
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const { confirmPassword, ...registerData } = formData;
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";
      await axios.post(`${API_BASE}/api/auth/register`, registerData);
      setMessage("Registration successful! Redirecting to login...");
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      width: "100vw",
      background: "linear-gradient(135deg, #18181b 0%, #23232b 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      overflow: "hidden"
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
        {[...Array(18)].map((_, i) => {
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
        {[...Array(12)].map((_, i) => {
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
        {/* Register Icon */}
        <g opacity="0.18">
          <rect x="900" y="400" width="120" height="120" rx="32" fill="#a3e635" />
          <circle cx="960" cy="440" r="28" fill="#18181b" />
          <rect x="930" y="480" width="60" height="18" rx="8" fill="#18181b" />
          <rect x="950" y="510" width="20" height="8" rx="4" fill="#2563eb" />
        </g>
      </svg>
      <style jsx global>{`
        @keyframes floatBG {
          0% { transform: translateY(0); }
          100% { transform: translateY(-20px); }
        }
      `}</style>
      <div
        style={{
          background: "linear-gradient(135deg, #e6f4ea 0%, #cde7d8 100%)",
          borderRadius: "24px",
          boxShadow: "0 8px 24px rgba(45,138,78,0.10), 0 1.5px 4px rgba(45,138,78,0.08)",
          padding: "48px 40px",
          maxWidth: 420,
          width: "100%",
          margin: 16,
          border: "1.5px solid #2d8a4e",
          textAlign: "center",
          color: "#222",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Card Border Gradient */}
        <div style={{
          position: "absolute",
          top: "-2px",
          left: "-2px",
          right: "-2px",
          bottom: "-2px",
          background: "linear-gradient(135deg, rgba(0, 128, 0, 0.2), rgba(0, 128, 0, 0.1))",
          borderRadius: "26px",
          zIndex: -1,
        }} />
        <h2 style={{ fontSize: 30, fontWeight: 700, marginBottom: 10, color: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <span role="img" aria-label="sparkles">✨</span> Create Your Account
        </h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', background: '#f4f8f6', borderRadius: 10, border: '1.5px solid #cde7d8', padding: '10px 14px', flex: 1, minWidth: 0 }}>
              <span style={{ fontSize: 20, marginRight: 10 }}>🧑</span>
              <input
                id="firstName"
                name="firstName"
                type="text"
                autoComplete="given-name"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                required
                style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 16, color: '#222', minWidth: 0 }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', background: '#f4f8f6', borderRadius: 10, border: '1.5px solid #cde7d8', padding: '10px 14px', flex: 1, minWidth: 0, marginTop: 0 }}>
              <span style={{ fontSize: 20, marginRight: 10 }}>👤</span>
              <input
                id="lastName"
                name="lastName"
                type="text"
                autoComplete="family-name"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                required
                style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 16, color: '#222', minWidth: 0 }}
              />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', background: '#f4f8f6', borderRadius: 10, border: '1.5px solid #cde7d8', padding: '10px 14px' }}>
            <span style={{ fontSize: 20, marginRight: 10 }}>🆔</span>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
              style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 16, color: '#222' }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', background: '#f4f8f6', borderRadius: 10, border: '1.5px solid #cde7d8', padding: '10px 14px' }}>
            <span style={{ fontSize: 20, marginRight: 10 }}>📧</span>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              required
              style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 16, color: '#222' }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', background: '#f4f8f6', borderRadius: 10, border: '1.5px solid #cde7d8', padding: '10px 14px' }}>
            <span style={{ fontSize: 20, marginRight: 10 }}>🔑</span>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 16, color: '#222' }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', background: '#f4f8f6', borderRadius: 10, border: '1.5px solid #cde7d8', padding: '10px 14px' }}>
            <span style={{ fontSize: 20, marginRight: 10 }}>🔒</span>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 16, color: '#222' }}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #2d8a4e, #1a472a)',
              color: '#fff',
              fontWeight: 600,
              fontSize: 17,
              border: 'none',
              borderRadius: 10,
              padding: '13px 0',
              marginTop: 10,
              boxShadow: '0 4px 12px rgba(45,138,78,0.13)',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              transition: 'all 0.2s',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? (
              <>
                <span className="animate-spin" style={{ fontSize: 18 }}>🔄</span> Creating account...
              </>
            ) : (
              <>
                <span style={{ fontSize: 18 }}>✨</span> Create Account
              </>
            )}
          </button>
          {message && (
            <p style={{ marginTop: 12, textAlign: 'center', fontWeight: 500, color: message.includes('successful') ? '#16a34a' : '#dc2626' }}>{message}</p>
          )}
        </form>
        <div style={{ marginTop: 18, fontSize: 13, color: '#2d8a4e', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <span role="img" aria-label="secure">🔒</span> Your credentials are encrypted and secure.
        </div>
      </div>
    </div>
  );
} 