import { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function Login() {
  const [tab, setTab] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError(""); setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  const handleSignup = async () => {
    setError(""); 
    if (!name) { setError("Please enter your name"); return; }
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: name });
      await setDoc(doc(db, "users", cred.user.uid), {
        uid: cred.user.uid, email, name, role: "user", createdAt: new Date()
      });
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  const fillAdmin = () => {
    setTab("login");
    setEmail("admin@fostride.com");
    setPassword("Admin@123");
  };

  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"linear-gradient(135deg, #0e1a14 0%, #1a3a26 50%, #0e2a1a 100%)", position:"relative", overflow:"hidden" }}>
      
      {/* Background blobs */}
      <div style={{ position:"absolute", width:600, height:600, borderRadius:"50%", background:"radial-gradient(circle, rgba(45,179,110,0.15) 0%, transparent 70%)", top:-100, right:-100 }} />
      <div style={{ position:"absolute", width:400, height:400, borderRadius:"50%", background:"radial-gradient(circle, rgba(26,122,74,0.2) 0%, transparent 70%)", bottom:-80, left:-80 }} />

      <div style={{ background:"rgba(255,255,255,0.97)", borderRadius:24, padding:"48px 44px", width:440, position:"relative", zIndex:1, boxShadow:"0 24px 64px rgba(0,0,0,0.3)" }}>
        
        {/* Logo */}
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
          <div style={{ width:40, height:40, background:"#1a7a4a", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M17.66 8L12 2.35 6.34 8C4.78 9.56 4 11.64 4 13.64c0 2 .78 4.04 2.34 5.6 1.56 1.56 3.61 2.36 5.66 2.36s4.1-.79 5.66-2.36C19.22 17.68 20 15.64 20 13.64c0-2-.78-4.08-2.34-5.64z"/></svg>
          </div>
          <span style={{ fontFamily:"Syne, sans-serif", fontSize:22, fontWeight:800, color:"#0e1a14" }}>Fos<span style={{ color:"#2db36e" }}>tride</span></span>
        </div>
        <p style={{ fontSize:13, color:"#5a7066", marginBottom:32 }}>W.I.S.E. — Waste Intelligent Sorting Engine</p>

        {/* Tabs */}
        <div style={{ display:"flex", gap:4, background:"#f4f7f5", borderRadius:10, padding:4, marginBottom:28 }}>
          {["login","signup"].map(t => (
            <button key={t} onClick={() => { setTab(t); setError(""); }} style={{ flex:1, padding:9, border:"none", background: tab===t ? "white" : "transparent", borderRadius:7, fontSize:14, fontWeight:500, color: tab===t ? "#0e1a14" : "#5a7066", boxShadow: tab===t ? "0 1px 4px rgba(0,0,0,0.1)" : "none", transition:"all 0.2s", fontFamily:"Space Grotesk, sans-serif" }}>
              {t === "login" ? "Sign In" : "Sign Up"}
            </button>
          ))}
        </div>

        {/* Fields */}
        {tab === "signup" && (
          <div style={{ marginBottom:16 }}>
            <label style={{ display:"block", fontSize:13, fontWeight:500, color:"#5a7066", marginBottom:6 }}>Full Name</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" style={{ width:"100%", padding:"12px 14px", border:"1.5px solid #d4e2da", borderRadius:10, fontSize:14, outline:"none", color:"#0e1a14" }} />
          </div>
        )}
        <div style={{ marginBottom:16 }}>
          <label style={{ display:"block", fontSize:13, fontWeight:500, color:"#5a7066", marginBottom:6 }}>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" style={{ width:"100%", padding:"12px 14px", border:"1.5px solid #d4e2da", borderRadius:10, fontSize:14, outline:"none", color:"#0e1a14" }} />
        </div>
        <div style={{ marginBottom:16 }}>
          <label style={{ display:"block", fontSize:13, fontWeight:500, color:"#5a7066", marginBottom:6 }}>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" onKeyDown={e => e.key === "Enter" && (tab === "login" ? handleLogin() : handleSignup())} style={{ width:"100%", padding:"12px 14px", border:"1.5px solid #d4e2da", borderRadius:10, fontSize:14, outline:"none", color:"#0e1a14" }} />
        </div>

        {error && <div style={{ background:"#ffeaea", color:"#c0392b", padding:"10px 14px", borderRadius:8, fontSize:13, marginBottom:12 }}>{error}</div>}

        <button onClick={tab === "login" ? handleLogin : handleSignup} disabled={loading} style={{ width:"100%", padding:14, background:"#1a7a4a", color:"white", border:"none", borderRadius:10, fontSize:15, fontWeight:600, fontFamily:"Space Grotesk, sans-serif", transition:"all 0.2s", opacity: loading ? 0.7 : 1 }}>
          {loading ? <span className="spinner" /> : tab === "login" ? "Sign In" : "Create Account"}
        </button>

        <p style={{ textAlign:"center", marginTop:16, fontSize:12, color:"#5a7066" }}>
          Admin? <button onClick={fillAdmin} style={{ background:"none", border:"none", color:"#1a7a4a", fontSize:12, textDecoration:"underline", fontFamily:"Space Grotesk, sans-serif" }}>Use admin credentials</button>
        </p>
      </div>
    </div>
  );
}