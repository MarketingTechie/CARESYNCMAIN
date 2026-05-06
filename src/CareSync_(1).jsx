import { useState, useEffect } from "react";

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --mint:    #00C896;
    --mint-lt: #E6FAF5;
    --sky:     #3B82F6;
    --amber:   #F59E0B;
    --rose:    #F43F5E;
    --purple:  #8B5CF6;
    --ink:     #0F172A;
    --slate:   #475569;
    --mist:    #F1F5F9;
    --white:   #FFFFFF;
    --card-shadow: 0 4px 24px rgba(15,23,42,.08);
    --card-hover:  0 8px 40px rgba(15,23,42,.14);
  }

  body { font-family: 'Sora', sans-serif; background: var(--mist); color: var(--ink); }

  .cs-app { display: flex; min-height: 100vh; }

  /* ── SIDEBAR ── */
  .cs-sidebar {
    width: 240px; flex-shrink: 0;
    background: var(--ink);
    display: flex; flex-direction: column;
    padding: 28px 20px; gap: 6px;
    position: sticky; top: 0; height: 100vh;
  }
  .cs-logo { display: flex; align-items: center; gap: 10px; margin-bottom: 32px; padding: 0 8px; }
  .cs-logo-icon {
    width: 36px; height: 36px; border-radius: 10px;
    background: linear-gradient(135deg, var(--mint), #00A37A);
    display: flex; align-items: center; justify-content: center;
    font-size: 18px;
  }
  .cs-logo-text { font-family: 'DM Serif Display', serif; font-size: 22px; color: var(--white); letter-spacing: .5px; }

  .cs-nav-item {
    display: flex; align-items: center; gap: 12px;
    padding: 11px 14px; border-radius: 10px; cursor: pointer;
    font-size: 14px; font-weight: 500; color: #94A3B8;
    transition: all .2s; border: none; background: none; width: 100%; text-align: left;
  }
  .cs-nav-item:hover { background: rgba(255,255,255,.07); color: var(--white); }
  .cs-nav-item.active { background: rgba(0,200,150,.15); color: var(--mint); }
  .cs-nav-item span.icon { font-size: 18px; width: 22px; text-align: center; }

  .cs-sidebar-footer { margin-top: auto; padding: 14px; border-radius: 12px; background: rgba(255,255,255,.05); }
  .cs-sidebar-footer p { font-size: 11px; color: #64748B; line-height: 1.6; }

  /* ── MAIN ── */
  .cs-main { flex: 1; display: flex; flex-direction: column; overflow-x: hidden; }

  .cs-topbar {
    background: var(--white); border-bottom: 1px solid #E2E8F0;
    padding: 18px 32px; display: flex; align-items: center; justify-content: space-between;
    position: sticky; top: 0; z-index: 10;
  }
  .cs-topbar h1 { font-family: 'DM Serif Display', serif; font-size: 26px; color: var(--ink); }
  .cs-topbar p { font-size: 13px; color: var(--slate); margin-top: 2px; }
  .cs-date-badge {
    background: var(--mint-lt); color: var(--mint);
    padding: 7px 16px; border-radius: 20px; font-size: 13px; font-weight: 600;
  }

  .cs-content { padding: 28px 32px; flex: 1; }

  /* ── STAT CARDS ── */
  .cs-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; margin-bottom: 28px; }
  .cs-stat {
    background: var(--white); border-radius: 16px; padding: 22px;
    box-shadow: var(--card-shadow); transition: box-shadow .2s;
    border-left: 4px solid transparent;
  }
  .cs-stat:hover { box-shadow: var(--card-hover); }
  .cs-stat.green  { border-color: var(--mint); }
  .cs-stat.blue   { border-color: var(--sky); }
  .cs-stat.amber  { border-color: var(--amber); }
  .cs-stat.rose   { border-color: var(--rose); }
  .cs-stat-icon { font-size: 24px; margin-bottom: 12px; }
  .cs-stat-num { font-family: 'DM Serif Display', serif; font-size: 32px; color: var(--ink); }
  .cs-stat-label { font-size: 12px; color: var(--slate); font-weight: 500; margin-top: 4px; }

  /* ── GRID ── */
  .cs-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 22px; }
  .cs-grid-full { grid-column: 1 / -1; }

  /* ── CARD ── */
  .cs-card {
    background: var(--white); border-radius: 18px;
    box-shadow: var(--card-shadow); overflow: hidden;
  }
  .cs-card-header {
    padding: 20px 24px 0; display: flex; align-items: center; justify-content: space-between;
  }
  .cs-card-title { font-size: 15px; font-weight: 700; color: var(--ink); display: flex; align-items: center; gap: 8px; }
  .cs-card-body { padding: 18px 24px 22px; }

  /* ── FAMILY MEMBERS ── */
  .cs-members { display: flex; gap: 14px; flex-wrap: wrap; }
  .cs-member {
    display: flex; align-items: center; gap: 12px;
    background: var(--mist); border-radius: 14px; padding: 14px 18px;
    cursor: pointer; transition: all .2s; border: 2px solid transparent; flex: 1; min-width: 160px;
  }
  .cs-member:hover { border-color: var(--mint); background: var(--mint-lt); }
  .cs-member.selected { border-color: var(--mint); background: var(--mint-lt); }
  .cs-avatar {
    width: 44px; height: 44px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 20px; flex-shrink: 0;
  }
  .cs-member-info p { font-size: 13px; font-weight: 600; color: var(--ink); }
  .cs-member-info span { font-size: 11px; color: var(--slate); }

  /* ── MEDICINE ITEMS ── */
  .cs-med-list { display: flex; flex-direction: column; gap: 10px; }
  .cs-med-item {
    display: flex; align-items: center; gap: 14px;
    padding: 14px; border-radius: 12px; background: var(--mist);
    transition: all .2s;
  }
  .cs-med-item:hover { background: #E8F4FF; }
  .cs-med-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
  .cs-med-info { flex: 1; }
  .cs-med-name { font-size: 13px; font-weight: 600; color: var(--ink); }
  .cs-med-detail { font-size: 11px; color: var(--slate); margin-top: 2px; }
  .cs-med-time { font-size: 12px; font-weight: 600; padding: 4px 10px; border-radius: 8px; white-space: nowrap; }
  .cs-med-actions { display: flex; gap: 6px; }
  .cs-btn-taken {
    background: var(--mint); color: white; border: none; border-radius: 8px;
    padding: 5px 10px; font-size: 11px; font-weight: 600; cursor: pointer;
    font-family: 'Sora', sans-serif; transition: opacity .2s;
  }
  .cs-btn-taken:hover { opacity: .85; }
  .cs-btn-missed {
    background: var(--rose); color: white; border: none; border-radius: 8px;
    padding: 5px 10px; font-size: 11px; font-weight: 600; cursor: pointer;
    font-family: 'Sora', sans-serif; transition: opacity .2s;
  }
  .cs-btn-taken.taken { background: #94A3B8; cursor: default; }
  .cs-btn-missed.missed { background: #94A3B8; cursor: default; }

  /* ── APPOINTMENTS ── */
  .cs-apt-list { display: flex; flex-direction: column; gap: 10px; }
  .cs-apt-item {
    display: flex; gap: 14px; align-items: flex-start;
    padding: 14px; border-radius: 12px; background: var(--mist);
  }
  .cs-apt-date {
    background: var(--sky); color: white; border-radius: 10px;
    padding: 8px 12px; text-align: center; flex-shrink: 0; min-width: 52px;
  }
  .cs-apt-date .day { font-size: 20px; font-weight: 700; line-height: 1; }
  .cs-apt-date .mon { font-size: 10px; font-weight: 600; opacity: .85; }
  .cs-apt-info { flex: 1; }
  .cs-apt-title { font-size: 13px; font-weight: 600; color: var(--ink); }
  .cs-apt-sub { font-size: 11px; color: var(--slate); margin-top: 3px; }
  .cs-apt-badge {
    font-size: 10px; font-weight: 600; padding: 3px 8px; border-radius: 6px;
    margin-top: 6px; display: inline-block;
  }

  /* ── REFILLS ── */
  .cs-refill-list { display: flex; flex-direction: column; gap: 12px; }
  .cs-refill-item { padding: 14px; border-radius: 12px; background: var(--mist); }
  .cs-refill-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
  .cs-refill-name { font-size: 13px; font-weight: 600; color: var(--ink); }
  .cs-refill-count { font-size: 12px; font-weight: 600; }
  .cs-progress { height: 6px; border-radius: 10px; background: #E2E8F0; overflow: hidden; }
  .cs-progress-bar { height: 100%; border-radius: 10px; transition: width .5s; }

  /* ── EMERGENCY ── */
  .cs-emergency-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .cs-emer-btn {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: 8px; padding: 20px; border-radius: 14px; border: none; cursor: pointer;
    font-family: 'Sora', sans-serif; font-size: 13px; font-weight: 600;
    transition: transform .15s, box-shadow .15s;
  }
  .cs-emer-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,.15); }
  .cs-emer-btn:active { transform: scale(.97); }
  .cs-emer-btn .emer-icon { font-size: 28px; }

  /* ── ADD FORM ── */
  .cs-form { display: flex; flex-direction: column; gap: 12px; }
  .cs-input {
    border: 1.5px solid #E2E8F0; border-radius: 10px; padding: 10px 14px;
    font-family: 'Sora', sans-serif; font-size: 13px; color: var(--ink);
    outline: none; transition: border-color .2s; background: var(--white);
  }
  .cs-input:focus { border-color: var(--mint); }
  .cs-input-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .cs-btn-primary {
    background: linear-gradient(135deg, var(--mint), #00A37A);
    color: white; border: none; border-radius: 10px;
    padding: 12px; font-family: 'Sora', sans-serif; font-size: 14px; font-weight: 600;
    cursor: pointer; transition: opacity .2s;
  }
  .cs-btn-primary:hover { opacity: .9; }

  /* ── TABS ── */
  .cs-tabs { display: flex; gap: 6px; padding: 20px 24px 0; }
  .cs-tab {
    padding: 7px 16px; border-radius: 8px; font-size: 12px; font-weight: 600;
    cursor: pointer; border: none; font-family: 'Sora', sans-serif;
    transition: all .2s; color: var(--slate); background: var(--mist);
  }
  .cs-tab.active { background: var(--mint); color: white; }

  /* ── ADHERENCE ── */
  .cs-adhere-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px; }
  .cs-day-box {
    aspect-ratio: 1; border-radius: 8px; display: flex;
    align-items: center; justify-content: center; font-size: 10px; font-weight: 600;
  }

  /* ── MODAL ── */
  .cs-modal-backdrop {
    position: fixed; inset: 0; background: rgba(15,23,42,.5);
    display: flex; align-items: center; justify-content: center; z-index: 100;
    backdrop-filter: blur(4px);
  }
  .cs-modal {
    background: white; border-radius: 20px; padding: 28px; width: 420px; max-width: 95vw;
    box-shadow: 0 24px 64px rgba(0,0,0,.2);
  }
  .cs-modal h3 { font-family: 'DM Serif Display', serif; font-size: 22px; margin-bottom: 18px; }
  .cs-modal-actions { display: flex; gap: 10px; margin-top: 16px; }
  .cs-btn-secondary {
    flex: 1; background: var(--mist); color: var(--slate); border: none; border-radius: 10px;
    padding: 12px; font-family: 'Sora', sans-serif; font-size: 14px; font-weight: 600; cursor: pointer;
  }

  /* ── NOTIFICATION TOAST ── */
  .cs-toast {
    position: fixed; bottom: 28px; right: 28px;
    background: var(--ink); color: white; border-radius: 14px;
    padding: 14px 20px; display: flex; align-items: center; gap: 12px;
    box-shadow: 0 12px 40px rgba(0,0,0,.25); z-index: 200;
    animation: slideUp .3s ease; max-width: 320px;
  }
  @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  .cs-toast .toast-icon { font-size: 22px; }
  .cs-toast p { font-size: 13px; font-weight: 500; }
  .cs-toast .toast-close { margin-left: auto; cursor: pointer; opacity: .6; font-size: 18px; }

  /* ── EMPTY STATE ── */
  .cs-empty { text-align: center; padding: 28px; color: var(--slate); font-size: 13px; }
  .cs-empty .empty-icon { font-size: 36px; margin-bottom: 10px; }

  /* ── SCROLL ── */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 10px; }

  /* ── RESPONSIVE ── */
  @media (max-width: 900px) {
    .cs-stats { grid-template-columns: 1fr 1fr; }
    .cs-grid { grid-template-columns: 1fr; }
    .cs-sidebar { width: 64px; padding: 20px 10px; }
    .cs-logo-text, .cs-nav-item span:not(.icon), .cs-sidebar-footer { display: none; }
    .cs-nav-item { justify-content: center; padding: 12px; }
    .cs-content { padding: 20px 16px; }
    .cs-topbar { padding: 16px 20px; }
  }
`;

// ─── SAMPLE DATA ────────────────────────────────────────────────────────────
const INIT_MEMBERS = [
  { id: 1, name: "Papa", age: 58, relation: "Father", emoji: "👨‍🦳", color: "#3B82F6" },
  { id: 2, name: "Mummy", age: 54, relation: "Mother", emoji: "👩", color: "#F43F5E" },
  { id: 3, name: "Me", age: 22, relation: "Self", emoji: "🧑", color: "#00C896" },
  { id: 4, name: "Dadi", age: 78, relation: "Grandmother", emoji: "👵", color: "#F59E0B" },
];

const INIT_MEDS = [
  { id: 1, memberId: 1, name: "Metformin", dose: "500mg", freq: "Twice daily", time: "08:00 AM", stock: 24, maxStock: 30, status: null, color: "#3B82F6" },
  { id: 2, memberId: 1, name: "Amlodipine", dose: "5mg", freq: "Once daily", time: "09:00 AM", stock: 8, maxStock: 30, status: null, color: "#8B5CF6" },
  { id: 3, memberId: 2, name: "Thyronorm", dose: "100mcg", freq: "Once daily", time: "07:00 AM", stock: 5, maxStock: 30, status: null, color: "#F43F5E" },
  { id: 4, memberId: 4, name: "Ecosprin", dose: "75mg", freq: "Once daily", time: "08:30 AM", stock: 20, maxStock: 30, status: null, color: "#F59E0B" },
];

const INIT_APTS = [
  { id: 1, memberId: 1, title: "Diabetologist Follow-up", doctor: "Dr. Sharma", date: "12", month: "MAR", time: "11:00 AM", urgency: "upcoming" },
  { id: 2, memberId: 2, title: "Thyroid Check-up", doctor: "Dr. Priya Nair", date: "18", month: "MAR", time: "3:00 PM", urgency: "routine" },
  { id: 3, memberId: 4, title: "Cardiac Review", doctor: "Dr. Mehta", date: "08", month: "MAR", time: "10:00 AM", urgency: "urgent" },
];

const CONTACTS = [
  { name: "Family Doctor", icon: "👨‍⚕️", bg: "#EFF6FF", color: "#3B82F6", phone: "tel:+911234567890" },
  { name: "Emergency", icon: "🚑", bg: "#FFF1F2", color: "#F43F5E", phone: "tel:108" },
  { name: "Cardiologist", icon: "❤️", bg: "#FFF7ED", color: "#F59E0B", phone: "tel:+919876543210" },
  { name: "Pharmacy", icon: "💊", bg: "#F0FDF4", color: "#00C896", phone: "tel:+911122334455" },
];

// ─── MAIN APP ────────────────────────────────────────────────────────────────
export default function CareSync() {
  const [page, setPage] = useState("dashboard");
  const [members, setMembers] = useState(INIT_MEMBERS);
  const [meds, setMeds] = useState(INIT_MEDS);
  const [apts, setApts] = useState(INIT_APTS);
  const [selectedMember, setSelectedMember] = useState(null);
  const [modal, setModal] = useState(null);   // "addMed" | "addApt" | "addMember"
  const [toast, setToast] = useState(null);
  const [medStatus, setMedStatus] = useState({});  // { medId: "taken"|"missed" }

  // New form states
  const [newMed, setNewMed] = useState({ name: "", dose: "", freq: "Once daily", time: "", stock: "30" });
  const [newApt, setNewApt] = useState({ title: "", doctor: "", date: "", time: "" });
  const [newMember, setNewMember] = useState({ name: "", age: "", relation: "" });

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });

  const showToast = (msg, icon = "💊") => {
    setToast({ msg, icon });
    setTimeout(() => setToast(null), 3500);
  };

  const handleTaken = (medId) => {
    setMedStatus(s => ({ ...s, [medId]: "taken" }));
    showToast("Medicine marked as taken! ✅", "✅");
  };

  const handleMissed = (medId) => {
    setMedStatus(s => ({ ...s, [medId]: "missed" }));
    showToast("Reminder set for next dose.", "⏰");
  };

  const addMedicine = () => {
    if (!newMed.name || !newMed.dose || !newMed.time) return;
    const colors = ["#3B82F6","#8B5CF6","#F43F5E","#00C896","#F59E0B"];
    const med = { ...newMed, id: Date.now(), memberId: selectedMember || 1, stock: parseInt(newMed.stock) || 30, maxStock: 30, status: null, color: colors[meds.length % colors.length] };
    setMeds(m => [...m, med]);
    setNewMed({ name: "", dose: "", freq: "Once daily", time: "", stock: "30" });
    setModal(null);
    showToast(`${med.name} added to reminders!`, "💊");
  };

  const addAppointment = () => {
    if (!newApt.title || !newApt.date) return;
    const apt = { ...newApt, id: Date.now(), memberId: selectedMember || 1, month: "MAR", urgency: "upcoming" };
    setApts(a => [...a, apt]);
    setNewApt({ title: "", doctor: "", date: "", time: "" });
    setModal(null);
    showToast("Appointment scheduled!", "📅");
  };

  const addMember = () => {
    if (!newMember.name) return;
    const emojis = ["🧑","👦","👧","🧓","👨","👩"];
    const colors = ["#3B82F6","#F43F5E","#00C896","#8B5CF6","#F59E0B"];
    const m = { ...newMember, id: Date.now(), emoji: emojis[members.length % emojis.length], color: colors[members.length % colors.length] };
    setMembers(ms => [...ms, m]);
    setNewMember({ name: "", age: "", relation: "" });
    setModal(null);
    showToast(`${m.name} added to family!`, "👨‍👩‍👧");
  };

  const filteredMeds = selectedMember ? meds.filter(m => m.memberId === selectedMember) : meds;
  const filteredApts = selectedMember ? apts.filter(a => a.memberId === selectedMember) : apts;

  const lowStock = meds.filter(m => m.stock < 10);
  const adherenceRate = meds.length > 0 ? Math.round((Object.values(medStatus).filter(s => s === "taken").length / meds.length) * 100) : 0;

  const NAV = [
    { id: "dashboard", icon: "🏠", label: "Dashboard" },
    { id: "medicines",  icon: "💊", label: "Medicines" },
    { id: "appointments", icon: "📅", label: "Appointments" },
    { id: "refills",    icon: "🔄", label: "Refills" },
    { id: "emergency",  icon: "🚨", label: "Emergency" },
  ];

  return (
    <>
      <style>{styles}</style>
      <div className="cs-app">

        {/* ── SIDEBAR ── */}
        <aside className="cs-sidebar">
          <div className="cs-logo">
            <div className="cs-logo-icon">❤️</div>
            <span className="cs-logo-text">CareSync</span>
          </div>
          {NAV.map(n => (
            <button key={n.id} className={`cs-nav-item ${page === n.id ? "active" : ""}`} onClick={() => setPage(n.id)}>
              <span className="icon">{n.icon}</span>
              <span>{n.label}</span>
            </button>
          ))}
          <div className="cs-sidebar-footer">
            <p>🔒 CareSync keeps your family's health data private & secure.</p>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <main className="cs-main">
          <div className="cs-topbar">
            <div>
              <h1>Family Health Hub</h1>
              <p>Good morning! Here's today's health overview.</p>
            </div>
            <div className="cs-date-badge">📅 {dateStr}</div>
          </div>

          <div className="cs-content">

            {/* ─── DASHBOARD PAGE ─── */}
            {page === "dashboard" && (
              <>
                {/* Stats */}
                <div className="cs-stats">
                  <div className="cs-stat green">
                    <div className="cs-stat-icon">💊</div>
                    <div className="cs-stat-num">{meds.length}</div>
                    <div className="cs-stat-label">Active Medicines</div>
                  </div>
                  <div className="cs-stat blue">
                    <div className="cs-stat-icon">📅</div>
                    <div className="cs-stat-num">{apts.length}</div>
                    <div className="cs-stat-label">Appointments</div>
                  </div>
                  <div className="cs-stat amber">
                    <div className="cs-stat-icon">⚠️</div>
                    <div className="cs-stat-num">{lowStock.length}</div>
                    <div className="cs-stat-label">Low Stock Alerts</div>
                  </div>
                  <div className="cs-stat rose">
                    <div className="cs-stat-icon">📊</div>
                    <div className="cs-stat-num">{adherenceRate}%</div>
                    <div className="cs-stat-label">Today's Adherence</div>
                  </div>
                </div>

                <div className="cs-grid">
                  {/* Family Members */}
                  <div className="cs-card cs-grid-full">
                    <div className="cs-card-header">
                      <span className="cs-card-title">👨‍👩‍👧‍👦 Family Members</span>
                      <button className="cs-btn-primary" style={{padding:"7px 14px",fontSize:"12px"}} onClick={() => setModal("addMember")}>+ Add Member</button>
                    </div>
                    <div className="cs-card-body">
                      <div className="cs-members">
                        {members.map(m => (
                          <div key={m.id} className={`cs-member ${selectedMember === m.id ? "selected" : ""}`} onClick={() => setSelectedMember(selectedMember === m.id ? null : m.id)}>
                            <div className="cs-avatar" style={{background: m.color + "22", fontSize:"24px"}}>{m.emoji}</div>
                            <div className="cs-member-info">
                              <p>{m.name}</p>
                              <span>{m.relation}, {m.age}y</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      {selectedMember && <p style={{fontSize:"12px",color:"var(--mint)",marginTop:"12px",fontWeight:"600"}}>✓ Filtering by: {members.find(m=>m.id===selectedMember)?.name}  <span style={{cursor:"pointer",color:"var(--slate)"}} onClick={()=>setSelectedMember(null)}>(clear)</span></p>}
                    </div>
                  </div>

                  {/* Today's Meds */}
                  <div className="cs-card">
                    <div className="cs-card-header">
                      <span className="cs-card-title">💊 Today's Medicines</span>
                      <button className="cs-btn-primary" style={{padding:"7px 14px",fontSize:"12px"}} onClick={() => setModal("addMed")}>+ Add</button>
                    </div>
                    <div className="cs-card-body">
                      <div className="cs-med-list">
                        {filteredMeds.length === 0 && <div className="cs-empty"><div className="empty-icon">💊</div>No medicines yet</div>}
                        {filteredMeds.map(med => {
                          const st = medStatus[med.id];
                          const member = members.find(m => m.id === med.memberId);
                          return (
                            <div key={med.id} className="cs-med-item" style={{opacity: st ? .7 : 1}}>
                              <div className="cs-med-dot" style={{background: med.color}} />
                              <div className="cs-med-info">
                                <div className="cs-med-name">{med.name} <span style={{fontSize:"10px",color:"var(--slate)",fontWeight:"400"}}>({member?.name})</span></div>
                                <div className="cs-med-detail">{med.dose} · {med.freq}</div>
                              </div>
                              <div className="cs-med-time" style={{background: med.color + "18", color: med.color}}>{med.time}</div>
                              <div className="cs-med-actions">
                                {!st && <><button className="cs-btn-taken" onClick={() => handleTaken(med.id)}>✓</button><button className="cs-btn-missed" onClick={() => handleMissed(med.id)}>✗</button></>}
                                {st === "taken" && <button className="cs-btn-taken taken" disabled>✓ Taken</button>}
                                {st === "missed" && <button className="cs-btn-missed missed" disabled>✗ Missed</button>}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Appointments */}
                  <div className="cs-card">
                    <div className="cs-card-header">
                      <span className="cs-card-title">📅 Appointments</span>
                      <button className="cs-btn-primary" style={{padding:"7px 14px",fontSize:"12px"}} onClick={() => setModal("addApt")}>+ Add</button>
                    </div>
                    <div className="cs-card-body">
                      <div className="cs-apt-list">
                        {filteredApts.length === 0 && <div className="cs-empty"><div className="empty-icon">📅</div>No appointments</div>}
                        {filteredApts.map(apt => {
                          const member = members.find(m => m.id === apt.memberId);
                          const uc = apt.urgency === "urgent" ? { bg:"#FFF1F2", c:"#F43F5E", label:"Urgent" } : apt.urgency === "upcoming" ? { bg:"#EFF6FF", c:"#3B82F6", label:"Upcoming" } : { bg:"#F0FDF4", c:"#00C896", label:"Routine" };
                          return (
                            <div key={apt.id} className="cs-apt-item">
                              <div className="cs-apt-date">
                                <div className="day">{apt.date}</div>
                                <div className="mon">{apt.month}</div>
                              </div>
                              <div className="cs-apt-info">
                                <div className="cs-apt-title">{apt.title}</div>
                                <div className="cs-apt-sub">{apt.doctor} · {apt.time} · <em>{member?.name}</em></div>
                                <span className="cs-apt-badge" style={{background:uc.bg, color:uc.c}}>{uc.label}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Refill Status */}
                  <div className="cs-card">
                    <div className="cs-card-header"><span className="cs-card-title">🔄 Refill Alerts</span></div>
                    <div className="cs-card-body">
                      <div className="cs-refill-list">
                        {meds.map(med => {
                          const pct = Math.round((med.stock / med.maxStock) * 100);
                          const isLow = med.stock < 10;
                          return (
                            <div key={med.id} className="cs-refill-item">
                              <div className="cs-refill-row">
                                <span className="cs-refill-name">{med.name} {isLow && "⚠️"}</span>
                                <span className="cs-refill-count" style={{color: isLow ? "var(--rose)" : "var(--mint)"}}>{med.stock} pills left</span>
                              </div>
                              <div className="cs-progress">
                                <div className="cs-progress-bar" style={{width:`${pct}%`, background: isLow ? "var(--rose)" : "var(--mint)"}} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* 7-day adherence */}
                  <div className="cs-card">
                    <div className="cs-card-header"><span className="cs-card-title">📊 Weekly Adherence</span></div>
                    <div className="cs-card-body">
                      <div className="cs-adhere-grid">
                        {["M","T","W","T","F","S","S"].map((d,i) => {
                          const rate = [100,80,100,60,100,100,0][i];
                          const bg = rate === 100 ? "#DCFCE7" : rate > 60 ? "#FEF9C3" : rate > 0 ? "#FEE2E2" : "#F1F5F9";
                          const col = rate === 100 ? "#15803D" : rate > 60 ? "#854D0E" : rate > 0 ? "#BE123C" : "#94A3B8";
                          return (
                            <div key={i}>
                              <div style={{textAlign:"center",fontSize:"10px",color:"var(--slate)",marginBottom:4,fontWeight:600}}>{d}</div>
                              <div className="cs-day-box" style={{background:bg,color:col}}>{rate > 0 ? `${rate}%` : "–"}</div>
                            </div>
                          );
                        })}
                      </div>
                      <div style={{marginTop:16,padding:"12px",background:"var(--mint-lt)",borderRadius:10}}>
                        <p style={{fontSize:13,color:"var(--mint)",fontWeight:600}}>🎯 Great job! Average adherence this week: 91%</p>
                      </div>
                    </div>
                  </div>

                  {/* Emergency */}
                  <div className="cs-card">
                    <div className="cs-card-header"><span className="cs-card-title">🚨 Emergency Contacts</span></div>
                    <div className="cs-card-body">
                      <div className="cs-emergency-grid">
                        {CONTACTS.map((c,i) => (
                          <a key={i} href={c.phone} style={{textDecoration:"none"}}>
                            <button className="cs-emer-btn" style={{background:c.bg,color:c.color,width:"100%"}}>
                              <span className="emer-icon">{c.icon}</span>
                              {c.name}
                            </button>
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>
              </>
            )}

            {/* ─── MEDICINES PAGE ─── */}
            {page === "medicines" && (
              <div className="cs-card">
                <div className="cs-card-header" style={{paddingBottom:16}}>
                  <span className="cs-card-title" style={{fontSize:18}}>💊 All Medicines</span>
                  <button className="cs-btn-primary" onClick={() => setModal("addMed")}>+ Add Medicine</button>
                </div>
                <div className="cs-card-body">
                  <div className="cs-med-list">
                    {meds.map(med => {
                      const st = medStatus[med.id];
                      const member = members.find(m => m.id === med.memberId);
                      return (
                        <div key={med.id} className="cs-med-item" style={{opacity: st ? .7:1}}>
                          <div className="cs-med-dot" style={{background: med.color}} />
                          <div className="cs-med-info" style={{flex:1}}>
                            <div className="cs-med-name">{med.name}</div>
                            <div className="cs-med-detail">{med.dose} · {med.freq} · 👤 {member?.name}</div>
                          </div>
                          <div className="cs-med-time" style={{background: med.color+"18",color:med.color}}>{med.time}</div>
                          <div className="cs-med-actions">
                            {!st && <><button className="cs-btn-taken" onClick={()=>handleTaken(med.id)}>✓ Taken</button><button className="cs-btn-missed" onClick={()=>handleMissed(med.id)}>✗ Miss</button></>}
                            {st === "taken" && <button className="cs-btn-taken taken" disabled>✓ Taken</button>}
                            {st === "missed" && <button className="cs-btn-missed missed" disabled>✗ Missed</button>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ─── APPOINTMENTS PAGE ─── */}
            {page === "appointments" && (
              <div className="cs-card">
                <div className="cs-card-header" style={{paddingBottom:16}}>
                  <span className="cs-card-title" style={{fontSize:18}}>📅 Doctor Appointments</span>
                  <button className="cs-btn-primary" onClick={() => setModal("addApt")}>+ Schedule</button>
                </div>
                <div className="cs-card-body">
                  <div className="cs-apt-list">
                    {apts.map(apt => {
                      const member = members.find(m => m.id === apt.memberId);
                      const uc = apt.urgency === "urgent" ? {bg:"#FFF1F2",c:"#F43F5E",label:"Urgent"} : apt.urgency === "upcoming" ? {bg:"#EFF6FF",c:"#3B82F6",label:"Upcoming"} : {bg:"#F0FDF4",c:"#00C896",label:"Routine"};
                      return (
                        <div key={apt.id} className="cs-apt-item">
                          <div className="cs-apt-date" style={{background: uc.c}}>
                            <div className="day">{apt.date}</div>
                            <div className="mon">{apt.month}</div>
                          </div>
                          <div className="cs-apt-info">
                            <div className="cs-apt-title">{apt.title}</div>
                            <div className="cs-apt-sub">{apt.doctor} · {apt.time}</div>
                            <div className="cs-apt-sub">👤 {member?.name}</div>
                            <span className="cs-apt-badge" style={{background:uc.bg,color:uc.c}}>{uc.label}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ─── REFILLS PAGE ─── */}
            {page === "refills" && (
              <div className="cs-card">
                <div className="cs-card-header" style={{paddingBottom:16}}>
                  <span className="cs-card-title" style={{fontSize:18}}>🔄 Prescription Refill Tracker</span>
                </div>
                <div className="cs-card-body">
                  {lowStock.length > 0 && (
                    <div style={{background:"#FFF1F2",borderRadius:12,padding:"14px 18px",marginBottom:18,display:"flex",gap:12,alignItems:"center"}}>
                      <span style={{fontSize:24}}>⚠️</span>
                      <div>
                        <p style={{fontWeight:700,color:"#F43F5E",fontSize:14}}>Low Stock Alert</p>
                        <p style={{fontSize:12,color:"var(--slate)"}}>{lowStock.map(m=>m.name).join(", ")} need refilling soon.</p>
                      </div>
                    </div>
                  )}
                  <div className="cs-refill-list">
                    {meds.map(med => {
                      const pct = Math.round((med.stock / med.maxStock) * 100);
                      const isLow = med.stock < 10;
                      const member = members.find(m => m.id === med.memberId);
                      return (
                        <div key={med.id} className="cs-refill-item" style={{border: isLow ? "1.5px solid #FCA5A5" : "1.5px solid transparent"}}>
                          <div className="cs-refill-row">
                            <div>
                              <span className="cs-refill-name">{med.name} {isLow && "⚠️"}</span>
                              <div style={{fontSize:11,color:"var(--slate)",marginTop:2}}>👤 {member?.name} · {med.dose}</div>
                            </div>
                            <div style={{textAlign:"right"}}>
                              <span className="cs-refill-count" style={{color:isLow?"var(--rose)":"var(--mint)"}}>{med.stock} / {med.maxStock}</span>
                              {isLow && <div style={{fontSize:10,color:"var(--rose)",fontWeight:600}}>Refill Now!</div>}
                            </div>
                          </div>
                          <div className="cs-progress">
                            <div className="cs-progress-bar" style={{width:`${pct}%`,background:isLow?"var(--rose)":"var(--mint)"}} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ─── EMERGENCY PAGE ─── */}
            {page === "emergency" && (
              <div className="cs-card">
                <div className="cs-card-header" style={{paddingBottom:16}}>
                  <span className="cs-card-title" style={{fontSize:18}}>🚨 Emergency Contacts</span>
                </div>
                <div className="cs-card-body">
                  <div style={{background:"#FFF1F2",borderRadius:12,padding:"16px 20px",marginBottom:20}}>
                    <p style={{fontWeight:700,color:"var(--rose)",fontSize:14}}>⚠️ In life-threatening emergencies, call 108 immediately.</p>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                    {CONTACTS.map((c,i) => (
                      <a key={i} href={c.phone} style={{textDecoration:"none"}}>
                        <button className="cs-emer-btn" style={{background:c.bg,color:c.color,width:"100%",padding:"28px 20px",fontSize:15}}>
                          <span className="emer-icon" style={{fontSize:36}}>{c.icon}</span>
                          {c.name}
                          <span style={{fontSize:11,opacity:.7,fontWeight:400}}>Tap to call</span>
                        </button>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>

      {/* ─── MODALS ─── */}
      {modal && (
        <div className="cs-modal-backdrop" onClick={() => setModal(null)}>
          <div className="cs-modal" onClick={e => e.stopPropagation()}>

            {modal === "addMed" && <>
              <h3>💊 Add Medicine</h3>
              <div className="cs-form">
                <select className="cs-input" value={newMed.memberId} onChange={e => setNewMed(n => ({...n, memberId: parseInt(e.target.value)}))}>
                  {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
                <input className="cs-input" placeholder="Medicine name (e.g. Paracetamol)" value={newMed.name} onChange={e => setNewMed(n => ({...n, name: e.target.value}))} />
                <div className="cs-input-row">
                  <input className="cs-input" placeholder="Dosage (e.g. 500mg)" value={newMed.dose} onChange={e => setNewMed(n => ({...n, dose: e.target.value}))} />
                  <input className="cs-input" type="time" value={newMed.time} onChange={e => setNewMed(n => ({...n, time: e.target.value}))} />
                </div>
                <div className="cs-input-row">
                  <select className="cs-input" value={newMed.freq} onChange={e => setNewMed(n => ({...n, freq: e.target.value}))}>
                    <option>Once daily</option><option>Twice daily</option><option>Thrice daily</option><option>Weekly</option>
                  </select>
                  <input className="cs-input" type="number" placeholder="Stock (pills)" value={newMed.stock} onChange={e => setNewMed(n => ({...n, stock: e.target.value}))} />
                </div>
              </div>
              <div className="cs-modal-actions">
                <button className="cs-btn-secondary" onClick={() => setModal(null)}>Cancel</button>
                <button className="cs-btn-primary" style={{flex:1}} onClick={addMedicine}>Add Medicine</button>
              </div>
            </>}

            {modal === "addApt" && <>
              <h3>📅 Add Appointment</h3>
              <div className="cs-form">
                <select className="cs-input" onChange={e => setNewApt(n => ({...n, memberId: parseInt(e.target.value)}))}>
                  {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
                <input className="cs-input" placeholder="Appointment title (e.g. Cardiac Review)" value={newApt.title} onChange={e => setNewApt(n => ({...n, title: e.target.value}))} />
                <input className="cs-input" placeholder="Doctor name" value={newApt.doctor} onChange={e => setNewApt(n => ({...n, doctor: e.target.value}))} />
                <div className="cs-input-row">
                  <input className="cs-input" type="date" value={newApt.date} onChange={e => setNewApt(n => ({...n, date: e.target.value}))} />
                  <input className="cs-input" type="time" value={newApt.time} onChange={e => setNewApt(n => ({...n, time: e.target.value}))} />
                </div>
              </div>
              <div className="cs-modal-actions">
                <button className="cs-btn-secondary" onClick={() => setModal(null)}>Cancel</button>
                <button className="cs-btn-primary" style={{flex:1}} onClick={addAppointment}>Schedule</button>
              </div>
            </>}

            {modal === "addMember" && <>
              <h3>👨‍👩‍👧 Add Family Member</h3>
              <div className="cs-form">
                <input className="cs-input" placeholder="Name (e.g. Nana)" value={newMember.name} onChange={e => setNewMember(n => ({...n, name: e.target.value}))} />
                <div className="cs-input-row">
                  <input className="cs-input" type="number" placeholder="Age" value={newMember.age} onChange={e => setNewMember(n => ({...n, age: e.target.value}))} />
                  <input className="cs-input" placeholder="Relation (e.g. Uncle)" value={newMember.relation} onChange={e => setNewMember(n => ({...n, relation: e.target.value}))} />
                </div>
              </div>
              <div className="cs-modal-actions">
                <button className="cs-btn-secondary" onClick={() => setModal(null)}>Cancel</button>
                <button className="cs-btn-primary" style={{flex:1}} onClick={addMember}>Add Member</button>
              </div>
            </>}

          </div>
        </div>
      )}

      {/* ─── TOAST ─── */}
      {toast && (
        <div className="cs-toast">
          <span className="toast-icon">{toast.icon}</span>
          <p>{toast.msg}</p>
          <span className="toast-close" onClick={() => setToast(null)}>✕</span>
        </div>
      )}
    </>
  );
}
