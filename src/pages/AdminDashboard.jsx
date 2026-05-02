import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { collection, query, orderBy, onSnapshot, doc } from "firebase/firestore";
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from "recharts";
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

export default function AdminDashboard({ user }) {
  const [entries, setEntries]       = useState([]);
  const [users, setUsers]           = useState([]);
  const [adminData, setAdminData]   = useState(null);
  const [filterType, setFilterType] = useState("");
  const [searchUser, setSearchUser] = useState("");
  const [toast, setToast]           = useState({ show:false, msg:"", type:"" });

  useEffect(() => {
    // Real-time listener for all waste entries
    const unsubEntries = onSnapshot(
      query(collection(db, "waste_entries"), orderBy("submittedAt","desc")),
      snap => setEntries(snap.docs.map(d => ({ id:d.id, ...d.data() })))
    );

    // Real-time listener for all users — exclude admins
    const unsubUsers = onSnapshot(
      collection(db, "users"),
      snap => setUsers(snap.docs.map(d => ({ id:d.id, ...d.data() })).filter(u => u.role !== "admin"))
    );

    // Real-time listener for admin's own profile (for name updates)
    const unsubAdmin = onSnapshot(
      doc(db, "users", user.uid),
      snap => { if (snap.exists()) setAdminData(snap.data()); }
    );

    return () => { unsubEntries(); unsubUsers(); unsubAdmin(); };
  }, []);

  // Use live adminData name if available
  const adminName = adminData?.name || user?.displayName || user?.email?.split("@")[0];

  // Stats
  const now = new Date();
  const totalQty   = entries.reduce((s,e) => s+(e.quantity||0), 0);
  const todayCount = entries.filter(e => {
    const d = e.submittedAt?.toDate ? e.submittedAt.toDate() : new Date();
    return d.toDateString() === now.toDateString();
  }).length;

  // Chart data
  const typeCounts = {};
  const typeQtys   = {};
  entries.forEach(e => {
    typeCounts[e.wasteType] = (typeCounts[e.wasteType]||0) + 1;
    typeQtys[e.wasteType]   = (typeQtys[e.wasteType]||0)   + (e.quantity||0);
  });
  const donutData = WASTE_TYPES.map(t => ({ name:t.label, value:typeCounts[t.key]||0, color:t.color })).filter(d=>d.value>0);
  const barData   = WASTE_TYPES.map(t => ({ name:t.label, kg: parseFloat((typeQtys[t.key]||0).toFixed(2)), color:t.color }));

  // Filtered entries
  const filtered = entries.filter(e =>
    (!filterType || e.wasteType === filterType) &&
    (!searchUser || (e.name||"").toLowerCase().includes(searchUser.toLowerCase()) || (e.email||"").toLowerCase().includes(searchUser.toLowerCase()))
  );

  const statCards = [
    { label:"Total Entries",  value: entries.length,           sub:"All users",     accent:true },
    { label:"Total Users",    value: users.length,             sub:"Registered" },
    { label:"Total Quantity", value: totalQty.toFixed(1)+"kg", sub:"kg tracked" },
    { label:"Today",          value: todayCount,               sub:"Entries logged" },
  ];

  return (
    <div style={{ minHeight:"100vh", background:"#f4f7f5" }}>
      <Navbar user={{ ...user, displayName: adminName }} role="admin" />
      <div style={{ padding:"32px 28px", maxWidth:1200, margin:"0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom:28 }}>
          <h1 style={{ fontFamily:"Syne, sans-serif", fontSize:28, fontWeight:800, color:"#0e1a14" }}>Admin Dashboard</h1>
          <p style={{ fontSize:14, color:"#5a7066", marginTop:4 }}>W.I.S.E. — Waste Intelligent Sorting Engine · All submissions</p>
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

        {/* Charts */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginBottom:20 }}>

          {/* Donut */}
          <div style={{ background:"white", borderRadius:16, padding:24, boxShadow:"0 2px 16px rgba(0,0,0,0.08)", border:"1px solid #d4e2da" }}>
            <h3 style={{ fontSize:15, fontWeight:600, color:"#0e1a14", marginBottom:20 }}>📊 Waste Type Distribution</h3>
            {donutData.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={donutData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} dataKey="value" paddingAngle={3}>
                    {donutData.map((entry,i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip formatter={(v) => [v, "Entries"]} />
                  <Legend iconType="circle" iconSize={10} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height:260, display:"flex", alignItems:"center", justifyContent:"center", color:"#5a7066", flexDirection:"column", gap:12 }}>
                <div style={{ fontSize:40 }}>📭</div>
                <p style={{ fontSize:14 }}>No data yet</p>
              </div>
            )}
          </div>

          {/* Bar */}
          <div style={{ background:"white", borderRadius:16, padding:24, boxShadow:"0 2px 16px rgba(0,0,0,0.08)", border:"1px solid #d4e2da" }}>
            <h3 style={{ fontSize:15, fontWeight:600, color:"#0e1a14", marginBottom:20 }}>📈 Quantity by Type (kg)</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={barData} margin={{ top:5, right:10, left:0, bottom:5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontFamily:"Space Grotesk", fontSize:12 }} />
                <YAxis tick={{ fontFamily:"Space Grotesk", fontSize:12 }} />
                <Tooltip formatter={(v) => [v+"kg", "Quantity"]} />
                <Bar dataKey="kg" radius={[6,6,0,0]}>
                  {barData.map((entry,i) => <Cell key={i} fill={entry.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* All Submissions */}
        <div style={{ background:"white", borderRadius:16, padding:24, boxShadow:"0 2px 16px rgba(0,0,0,0.08)", border:"1px solid #d4e2da" }}>
          <h3 style={{ fontSize:15, fontWeight:600, color:"#0e1a14", marginBottom:16 }}>📋 All Submissions</h3>

          {/* Filters */}
          <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap" }}>
            <select value={filterType} onChange={e=>setFilterType(e.target.value)} style={{ padding:"8px 12px", border:"1.5px solid #d4e2da", borderRadius:8, fontFamily:"Space Grotesk, sans-serif", fontSize:13, background:"#f4f7f5", color:"#0e1a14", outline:"none" }}>
              <option value="">All Types</option>
              {WASTE_TYPES.map(t => <option key={t.key} value={t.key}>{t.label}</option>)}
            </select>
            <input
              type="text"
              value={searchUser}
              onChange={e=>setSearchUser(e.target.value)}
              placeholder="Search by user name or email..."
              style={{ padding:"8px 12px", border:"1.5px solid #d4e2da", borderRadius:8, fontFamily:"Space Grotesk, sans-serif", fontSize:13, background:"#f4f7f5", color:"#0e1a14", outline:"none", minWidth:240 }}
            />
            <span style={{ marginLeft:"auto", fontSize:13, color:"#5a7066", alignSelf:"center" }}>{filtered.length} entries</span>
          </div>

          {/* List */}
          {filtered.length === 0 ? (
            <div style={{ textAlign:"center", padding:"40px 20px", color:"#5a7066" }}>
              <div style={{ fontSize:40, marginBottom:12 }}>📭</div>
              <p style={{ fontSize:14 }}>No entries found.</p>
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:10, maxHeight:480, overflowY:"auto" }}>
              {filtered.map(e => {
                const t = WASTE_TYPES.find(w => w.key === e.wasteType);
                const d = e.submittedAt?.toDate ? e.submittedAt.toDate() : new Date();
                return (
                  <div key={e.id} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 16px", background:"#f4f7f5", borderRadius:10, borderLeft:`3px solid ${t?.color||"#ccc"}` }}>
                    <div>
                      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3 }}>
                        <span style={{ fontSize:13, fontWeight:600, color:"#0e1a14", textTransform:"capitalize" }}>{t?.icon} {e.wasteType}</span>
                        {e.notes && <span style={{ fontSize:12, color:"#5a7066" }}>{e.notes.substring(0,40)}{e.notes.length>40?"...":""}</span>}
                      </div>
                      <div style={{ fontSize:12, color:"#5a7066" }}>
                        {d.toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})} · {d.toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"})}
                      </div>
                      <div style={{ fontSize:12, color:"#5a7066", marginTop:2 }}>
                        👤 {e.name||"Unknown"} · {e.email||""}
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