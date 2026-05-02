import { auth } from "../firebase";
import { signOut } from "firebase/auth";

export default function Navbar({ user, role }) {
  const handleLogout = () => signOut(auth);
  const displayName = user?.displayName || user?.email?.split("@")[0];

  return (
    <nav style={{ background:"#0e1a14", color:"white", padding:"0 28px", display:"flex", alignItems:"center", justifyContent:"space-between", height:60, position:"sticky", top:0, zIndex:100 }}>
      
      {/* Logo */}
      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
        <div style={{ width:30, height:30, background:"#1a7a4a", borderRadius:7, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M17.66 8L12 2.35 6.34 8C4.78 9.56 4 11.64 4 13.64c0 2 .78 4.04 2.34 5.6 1.56 1.56 3.61 2.36 5.66 2.36s4.1-.79 5.66-2.36C19.22 17.68 20 15.64 20 13.64c0-2-.78-4.08-2.34-5.64z"/></svg>
        </div>
        <span style={{ fontFamily:"Syne, sans-serif", fontSize:17, fontWeight:800 }}>
          Fos<span style={{ color:"#2db36e" }}>tride</span>
        </span>
      </div>

      {/* Right */}
      <div style={{ display:"flex", alignItems:"center", gap:16 }}>
        <span style={{ fontSize:13, color:"rgba(255,255,255,0.6)" }}>
          Hello, <strong style={{ color:"white" }}>{displayName}</strong>
        </span>
        <span style={{ fontSize:11, fontWeight:600, padding:"3px 9px", borderRadius:20, background: role === "admin" ? "#e8a020" : "#1a7a4a", color:"white", textTransform:"uppercase", letterSpacing:"0.5px" }}>
          {role === "admin" ? "Admin" : "User"}
        </span>
        <button onClick={handleLogout} style={{ padding:"7px 16px", background:"rgba(255,255,255,0.1)", color:"white", border:"1px solid rgba(255,255,255,0.2)", borderRadius:8, fontSize:13, fontFamily:"Space Grotesk, sans-serif", transition:"all 0.2s" }}>
          Sign Out
        </button>
      </div>
    </nav>
  );
}