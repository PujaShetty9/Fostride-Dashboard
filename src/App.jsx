import { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  const [user, setUser]           = useState(null);
  const [role, setRole]           = useState(null);
  const [loading, setLoading]     = useState(true);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        const ref = doc(db, "users", firebaseUser.uid);
        let snap = await getDoc(ref);
        if (!snap.exists()) {
          await setDoc(ref, {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName || firebaseUser.email.split("@")[0],
            role: "user",
            createdAt: new Date(),
          });
          snap = await getDoc(ref);
        }
        setRole(snap.data().role);
        setUser(firebaseUser);
      } else {
        setUser(null);
        setRole(null);
        setShowLogin(false);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  if (loading) return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#0e1a14" }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ width:48, height:48, border:"3px solid rgba(45,179,110,0.3)", borderTop:"3px solid #2db36e", borderRadius:"50%", animation:"spin 0.8s linear infinite", margin:"0 auto 16px" }}></div>
        <p style={{ color:"rgba(255,255,255,0.5)", fontFamily:"sans-serif", fontSize:14 }}>Loading W.I.S.E...</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (!user && showLogin) return <Login />;
  if (!user) return <Landing onGetStarted={() => setShowLogin(true)} />;
  if (role === "admin") return <AdminDashboard user={user} />;
  return <UserDashboard user={user} />;
}

export default App;