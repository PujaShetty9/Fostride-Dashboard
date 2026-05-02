import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, query, where, orderBy, onSnapshot, Timestamp, doc } from "firebase/firestore";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import Navbar from "../components/Navbar";

const WASTE_TYPES = [
  { key:"dry",        label:"Dry",        icon:"🟡", color:"#e8a020" },
  { key:"wet",        label:"Wet",        icon:"💧", color:"#2196f3" },
  { key:"recyclable", label:"Recyclable", icon:"♻️", color:"#2db36e" },
  { key:"hazardous",  label:"Hazardous",  icon:"⚠️", color:"#e53935" },
];

function Toast({ msg, type, show }) {
  return <div className={`toast${show?" show":""}${type==="error"?" error":""}`}>{msg}</div>;
}

function getNow() {
  const now = new Date();
  const pad = n => String(n).padStart(2,"0");
  return `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
}

export default function UserDashboard({ user }) {
  const [entries, setEntries]   = useState([]);
  const [userData, setUserData] = useState(null);
  const [wasteType, setWasteType] = useState("");
  const [quantity, setQuantity]   = useState("");
  const [notes, setNotes]         = useState("");
  const [datetime, setDatetime]   = useState(getNow());
  const [loading, setLoading]     = useState(false);
  const [toast, setToast]         = useState({ show:false, msg:"", type:"" });

  useEffect(() => {
    // Live clock — updates datetime every minute
    const clockInterval = setInterval(() => setDatetime(getNow()), 60000);

    // Real-time listener for user's own profile (name changes reflect instantly)
    const unsubProfile = onSnapshot(doc(db, "users", user.uid), snap => {
      if (snap.exists()) setUserData(snap.data());
    });

    // Real-time listener for user's waste entries
    const q = query(
      collection(db, "waste_entries"),
      where("uid", "==", user.uid),
      orderBy("submittedAt", "desc")
    );
    const unsubEntries = onSnapshot(q, snap => {
      setEntries(snap.docs.map(d => ({ id:d.id, ...d.data() })));
    }, error => {
      console.error("Firestore error:", error);
    });

    return () => {
      clearInterval(clockInterval);
      unsubProfile();
      unsubEntries();
    };
  }, []);

  const displayName = userData?.name || user?.displayName || user?.email?.split("@")[0];

  const showToast = (msg, type="success") => {
    setToast({ show:true, msg, type });
    setTimeout(() => setToast(t => ({ ...t, show:false })), 3000);
  };

  const handleSubmit = async () => {
    if (!wasteType) { showToast("Please select a waste type", "error"); return; }
    const qty = parseFloat(quantity);
    if (!qty || qty <= 0) { showToast("Please enter a valid quantity", "error"); return; }
    setLoading(true);
    try {
      await addDoc(collection(db, "waste_entries"), {
        uid: user.uid,
        email: user.email,
        name: displayName,
        wasteType, quantity: qty, notes,
        submittedAt: Timestamp.now(),
        createdAt: Timestamp.now(),
      });
      showToast("Entry logged successfully! ✅");
      setWasteType(""); setQuantity(""); setNotes("");
    } catch(e) {
      showToast("Error: " + e.message, "error");
    }
    setLoading(false);
  };

  // Stats
  const now = new Date();
  const totalQty = entries.reduce((s,e) => s + (e.quantity||0), 0);
  const thisMonth = entries.filter(e => {
    const d = e.submittedAt?.toDate ? e.submittedAt.toDate() : new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const typeCounts = {};
  entries.forEach(e => { typeCounts[e.wasteType] = (typeCounts[e.wasteType]||0)+1; });
  const topType = Object.entries(typeCounts).sort((a,b)=>b[1]-a[1])[0];
  const chartData = WASTE_TYPES.map(t => ({ name:t.label, value: typeCounts[t.key]||0, color:t.color })).filter(d => d.value > 0);

  const statCards = [
    { label:"Total Entries",  value: entries.length,            sub:"All time",      accent:true },
    { label:"This Month",     value: thisMonth.length,          sub:"Entries" },
    { label:"Total Quantity", value: totalQty.toFixed(1)+"kg",  sub:"Disposed" },
    { label:"Top Category",   value: topType ? topType[0].charAt(0).toUpperCase()+topType[0].slice(1) : "–", sub:"Most frequent" },
  ];

  return (
    <div style={{ minHeight:"100vh", background:"#f4f7f5" }}>
      <Navbar user={{ ...user, displayName }} role="user" />
      <div style={{ padding:"32px 28px", maxWidth:1200, margin:"0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom:28 }}>
          <h1 style={{ fontFamily:"Syne, sans-serif", fontSize:28, fontWeight:800, color:"#0e1a14" }}>My Waste Log</h1>
          <p style={{ fontSize:14, color:"#5a7066", marginTop:4 }}>Track and manage your waste disposal entries</p>
        </div>

        {/* Stat Cards */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(180px,1fr))", gap:16, marginBottom:28 }}>
          {statCards.map((s,i) => (
            <div key={i} style={{ background: s.accent ? "#1a7a4a" : "white", borderRadius:16, padding:"20px 22px", boxShadow:"0 2px 16px rgba(0,0,0,0.08)", border:"1px solid #d4e2da" }}>
              <div style={{ fontSize:12, color: s.accent ? "rgba(255,255,255,0.7)" : "#5a7066", fontWeight:500, textTransform:"uppercase", letterSpacing:"0.5px", marginBottom:8 }}>{s.label}</div>
              <div style={{ fontFamily:"DM Sans, sans-serif", fontSize:22, fontWeight:800, color: s.accent ? "white" : "#0e1a14", wordBreak:"break-word", lineHeight:1.2 }}>{s.value}</div>
              <div style={{ fontSize:12, color: s.accent ? "rgba(255,255,255,0.6)" : "#5a7066", marginTop:4 }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Form + Chart */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginBottom:20 }}>

          {/* Form */}
          <div style={{ background:"white", borderRadius:16, padding:24, boxShadow:"0 2px 16px rgba(0,0,0,0.08)", border:"1px solid #d4e2da" }}>
            <h3 style={{ fontSize:15, fontWeight:600, color:"#0e1a14", marginBottom:20 }}>♻️ Log New Entry</h3>

            {/* Waste Type */}
            <div style={{ marginBottom:16 }}>
              <label style={{ display:"block", fontSize:12, fontWeight:500, color:"#5a7066", marginBottom:8, textTransform:"uppercase", letterSpacing:"0.4px" }}>Waste Type</label>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8 }}>
                {WASTE_TYPES.map(t => (
                  <button key={t.key} onClick={() => setWasteType(t.key)} style={{ padding:"10px 6px", border: wasteType===t.key ? `2px solid ${t.color}` : "2px solid #d4e2da", borderRadius:10, background: wasteType===t.key ? t.color+"18" : "white", textAlign:"center", transition:"all 0.2s" }}>
                    <span style={{ fontSize:20, display:"block", marginBottom:4 }}>{t.icon}</span>
                    <span style={{ fontSize:11, fontWeight:600, color: wasteType===t.key ? t.color : "#5a7066" }}>{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity + DateTime */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
              <div>
                <label style={{ display:"block", fontSize:12, fontWeight:500, color:"#5a7066", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.4px" }}>Quantity (kg)</label>
                <input type="number" value={quantity} onChange={e=>setQuantity(e.target.value)} min="0.1" step="0.1" placeholder="e.g. 2.5" style={{ width:"100%", padding:"11px 13px", border:"1.5px solid #d4e2da", borderRadius:9, fontSize:14, outline:"none", background:"#f4f7f5", color:"#0e1a14" }} />
              </div>
              <div>
                <label style={{ display:"block", fontSize:12, fontWeight:500, color:"#5a7066", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.4px" }}>Date & Time</label>
                <input type="datetime-local" value={datetime} readOnly style={{ width:"100%", padding:"11px 13px", border:"1.5px solid #d4e2da", borderRadius:9, fontSize:14, outline:"none", background:"#f0f0f0", color:"#5a7066", cursor:"not-allowed" }} />
              </div>
            </div>

            {/* Notes */}
            <div style={{ marginBottom:16 }}>
              <label style={{ display:"block", fontSize:12, fontWeight:500, color:"#5a7066", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.4px" }}>Notes (optional)</label>
              <textarea value={notes} onChange={e=>setNotes(e.target.value)} rows={2} placeholder="Any additional info..." style={{ width:"100%", padding:"11px 13px", border:"1.5px solid #d4e2da", borderRadius:9, fontSize:14, outline:"none", background:"#f4f7f5", resize:"none", color:"#0e1a14" }} />
            </div>

            <button onClick={handleSubmit} disabled={loading} style={{ width:"100%", padding:13, background:"#1a7a4a", color:"white", border:"none", borderRadius:10, fontSize:14, fontWeight:600, fontFamily:"Space Grotesk, sans-serif", transition:"all 0.2s", opacity: loading ? 0.7 : 1 }}>
              {loading ? <span className="spinner" /> : "Submit Entry"}
            </button>
          </div>

          {/* Chart */}
          <div style={{ background:"white", borderRadius:16, padding:24, boxShadow:"0 2px 16px rgba(0,0,0,0.08)", border:"1px solid #d4e2da" }}>
            <h3 style={{ fontSize:15, fontWeight:600, color:"#0e1a14", marginBottom:20 }}>📊 My Waste Breakdown</h3>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={chartData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} dataKey="value" paddingAngle={3}>
                    {chartData.map((entry,i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip formatter={(v) => [v, "Entries"]} />
                  <Legend iconType="circle" iconSize={10} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height:260, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", color:"#5a7066" }}>
                <div style={{ fontSize:40, marginBottom:12 }}>📭</div>
                <p style={{ fontSize:14 }}>No entries yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Entries List */}
        <div style={{ background:"white", borderRadius:16, padding:24, boxShadow:"0 2px 16px rgba(0,0,0,0.08)", border:"1px solid #d4e2da" }}>
          <h3 style={{ fontSize:15, fontWeight:600, color:"#0e1a14", marginBottom:20 }}>📋 Recent Submissions</h3>
          {entries.length === 0 ? (
            <div style={{ textAlign:"center", padding:"40px 20px", color:"#5a7066" }}>
              <div style={{ fontSize:40, marginBottom:12 }}>📭</div>
              <p style={{ fontSize:14 }}>No entries yet. Log your first waste entry!</p>
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:10, maxHeight:360, overflowY:"auto" }}>
              {entries.map(e => {
                const t = WASTE_TYPES.find(w => w.key === e.wasteType);
                const d = e.submittedAt?.toDate ? e.submittedAt.toDate() : new Date();
                return (
                  <div key={e.id} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 14px", background:"#f4f7f5", borderRadius:10, borderLeft:`3px solid ${t?.color||"#ccc"}` }}>
                    <div>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <span style={{ fontSize:13, fontWeight:600, color:"#0e1a14", textTransform:"capitalize" }}>{t?.icon} {e.wasteType}</span>
                        {e.notes && <span style={{ fontSize:12, color:"#5a7066" }}>{e.notes.substring(0,40)}{e.notes.length>40?"...":""}</span>}
                      </div>
                      <div style={{ fontSize:12, color:"#5a7066", marginTop:2 }}>
                        {d.toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})} · {d.toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"})}
                      </div>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <div style={{ fontSize:15, fontWeight:700, color:"#0e1a14" }}>{parseFloat(e.quantity||0).toFixed(1)}</div>
                      <div style={{ fontSize:11, color:"#5a7066" }}>kg</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <Toast msg={toast.msg} type={toast.type} show={toast.show} />
    </div>
  );
}