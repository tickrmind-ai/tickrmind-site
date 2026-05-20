"use client";

import { useState, useEffect } from "react";

type Message = {
  role: "user" | "bot";
  text: string;
};

const FONT = `@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');`;

const styles = `
  ${FONT}
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #060a0f;
    --bg2: #0b1018;
    --bg3: #111820;
    --border: rgba(255,255,255,0.07);
    --green: #00e5a0;
    --green-dim: rgba(0,229,160,0.12);
    --green-glow: rgba(0,229,160,0.25);
    --red: #ff4466;
    --red-dim: rgba(255,68,102,0.12);
    --yellow: #f5c842;
    --yellow-dim: rgba(245,200,66,0.12);
    --text: #e8edf5;
    --muted: #5a6478;
    --font-display: 'Syne', sans-serif;
    --font-body: 'DM Sans', sans-serif;
  }
  body { background: var(--bg); color: var(--text); font-family: var(--font-body); }

  /* NAV */
  .nav { position: sticky; top: 0; z-index: 100; background: rgba(6,10,15,0.85); backdrop-filter: blur(16px); border-bottom: 1px solid var(--border); padding: 0 40px; display: flex; align-items: center; justify-content: space-between; height: 64px; }
  .nav-logo { font-family: var(--font-display); font-size: 22px; font-weight: 800; color: var(--green); letter-spacing: -0.5px; }
  .nav-sub { font-size: 9px; letter-spacing: 0.3em; color: var(--muted); text-transform: uppercase; margin-top: 2px; }
  .nav-links { display: flex; gap: 32px; }
  .nav-links a { font-size: 13px; color: var(--muted); text-decoration: none; transition: color 0.2s; }
  .nav-links a:hover { color: var(--text); }
  .nav-cta { background: var(--green); color: #060a0f; font-family: var(--font-display); font-weight: 700; font-size: 13px; padding: 10px 22px; border-radius: 100px; border: none; cursor: pointer; transition: all 0.2s; letter-spacing: 0.02em; }
  .nav-cta:hover { background: #00ffb3; transform: translateY(-1px); }

  /* HERO */
  .hero { max-width: 1200px; margin: 0 auto; padding: 80px 40px; display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; min-height: 80vh; }
  .hero-badge { display: inline-flex; align-items: center; gap: 8px; background: var(--green-dim); border: 1px solid rgba(0,229,160,0.2); border-radius: 100px; padding: 6px 16px; font-size: 12px; color: var(--green); letter-spacing: 0.05em; margin-bottom: 24px; }
  .hero-badge::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: var(--green); animation: pulse 2s infinite; }
  @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.4)} }
  .hero h1 { font-family: var(--font-display); font-size: clamp(42px, 5vw, 68px); font-weight: 800; line-height: 1.05; letter-spacing: -2px; color: var(--text); }
  .hero h1 em { font-style: normal; color: var(--green); }
  .hero-sub { margin-top: 20px; font-size: 17px; color: var(--muted); line-height: 1.7; max-width: 440px; font-weight: 300; }
  .hero-actions { display: flex; gap: 12px; margin-top: 36px; }
  .btn-primary { background: var(--green); color: #060a0f; font-family: var(--font-display); font-weight: 700; font-size: 14px; padding: 14px 32px; border-radius: 100px; border: none; cursor: pointer; transition: all 0.2s; }
  .btn-primary:hover { background: #00ffb3; transform: translateY(-2px); box-shadow: 0 8px 32px var(--green-glow); }
  .btn-ghost { background: transparent; color: var(--text); font-size: 14px; padding: 14px 28px; border-radius: 100px; border: 1px solid var(--border); cursor: pointer; transition: all 0.2s; font-family: var(--font-body); }
  .btn-ghost:hover { border-color: rgba(255,255,255,0.2); background: rgba(255,255,255,0.04); }
  .hero-note { margin-top: 16px; font-size: 12px; color: var(--muted); }

  /* SIGNAL CARD */
  .signal-card { background: var(--bg2); border: 1px solid var(--border); border-radius: 20px; padding: 28px; box-shadow: 0 32px 80px rgba(0,0,0,0.6); }
  .sc-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
  .sc-symbol { font-family: var(--font-display); font-size: 28px; font-weight: 800; letter-spacing: -1px; }
  .sc-time { font-size: 11px; color: var(--muted); margin-top: 4px; }
  .sc-verdict { padding: 6px 16px; border-radius: 100px; font-size: 12px; font-weight: 700; letter-spacing: 0.08em; font-family: var(--font-display); }
  .verdict-no { background: var(--red-dim); color: var(--red); border: 1px solid rgba(255,68,102,0.25); }
  .verdict-wait { background: var(--yellow-dim); color: var(--yellow); border: 1px solid rgba(245,200,66,0.25); }
  .verdict-go { background: var(--green-dim); color: var(--green); border: 1px solid rgba(0,229,160,0.25); }
  .sc-conf-label { font-size: 11px; color: var(--muted); margin-bottom: 8px; }
  .sc-conf-bar { height: 4px; background: rgba(255,255,255,0.06); border-radius: 4px; overflow: hidden; margin-bottom: 20px; }
  .sc-conf-fill { height: 100%; border-radius: 4px; transition: width 1s ease; }
  .sc-reasons { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px; }
  .sc-reason { display: flex; align-items: center; gap: 6px; font-size: 12px; padding: 6px 12px; border-radius: 8px; }
  .reason-no { background: var(--red-dim); color: #ff8fa3; border: 1px solid rgba(255,68,102,0.15); }
  .sc-rec { background: var(--green-dim); border: 1px solid rgba(0,229,160,0.15); border-radius: 12px; padding: 16px; font-size: 13px; color: #a0f5d8; line-height: 1.6; }
  .sc-rec strong { color: var(--green); }

  /* TICKER STRIP */
  .ticker-wrap { border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); background: var(--bg2); padding: 12px 0; overflow: hidden; }
  .ticker-inner { display: flex; gap: 48px; white-space: nowrap; animation: ticker 20s linear infinite; }
  @keyframes ticker { from{transform:translateX(0)} to{transform:translateX(-50%)} }
  .ticker-item { font-size: 12px; color: var(--muted); letter-spacing: 0.05em; display: flex; align-items: center; gap: 8px; }
  .ticker-item .up { color: var(--green); }
  .ticker-item .down { color: var(--red); }

  /* FEATURES */
  .section { max-width: 1200px; margin: 0 auto; padding: 80px 40px; }
  .section-label { font-size: 11px; letter-spacing: 0.3em; color: var(--green); text-transform: uppercase; margin-bottom: 16px; }
  .section-title { font-family: var(--font-display); font-size: clamp(32px, 4vw, 52px); font-weight: 800; letter-spacing: -1.5px; line-height: 1.1; }
  .section-sub { color: var(--muted); font-size: 16px; margin-top: 12px; font-weight: 300; }
  .features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px; margin-top: 48px; background: var(--border); border-radius: 20px; overflow: hidden; }
  .feat { background: var(--bg2); padding: 32px; transition: background 0.2s; }
  .feat:hover { background: var(--bg3); }
  .feat-icon { width: 44px; height: 44px; border-radius: 12px; background: var(--green-dim); display: flex; align-items: center; justify-content: center; font-size: 20px; margin-bottom: 20px; }
  .feat-title { font-family: var(--font-display); font-size: 17px; font-weight: 700; margin-bottom: 10px; }
  .feat-text { font-size: 14px; color: var(--muted); line-height: 1.65; font-weight: 300; }

  /* DEMO CHAT */
  .demo-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
  .chat-card { background: var(--bg2); border: 1px solid var(--border); border-radius: 20px; overflow: hidden; }
  .chat-header { padding: 20px 24px; border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 12px; }
  .chat-avatar { width: 40px; height: 40px; border-radius: 12px; background: var(--green-dim); display: flex; align-items: center; justify-content: center; font-size: 18px; }
  .chat-title { font-family: var(--font-display); font-weight: 700; font-size: 15px; }
  .chat-status { font-size: 11px; color: var(--green); }
  .chat-messages { padding: 20px; min-height: 280px; max-height: 280px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; }
  .msg { max-width: 85%; padding: 12px 16px; border-radius: 14px; font-size: 13px; line-height: 1.6; }
  .msg-bot { background: var(--bg3); color: var(--text); align-self: flex-start; border-bottom-left-radius: 4px; }
  .msg-user { background: var(--green); color: #060a0f; align-self: flex-end; border-bottom-right-radius: 4px; font-weight: 500; }
  .chat-input { border-top: 1px solid var(--border); padding: 16px; display: flex; gap: 10px; }
  .chat-input input { flex: 1; background: var(--bg3); border: 1px solid var(--border); border-radius: 12px; padding: 11px 16px; font-size: 13px; color: var(--text); outline: none; font-family: var(--font-body); transition: border-color 0.2s; }
  .chat-input input:focus { border-color: rgba(0,229,160,0.4); }
  .chat-input input::placeholder { color: var(--muted); }
  .chat-send { background: var(--green); color: #060a0f; border: none; border-radius: 12px; padding: 11px 18px; font-size: 16px; cursor: pointer; transition: all 0.2s; }
  .chat-send:hover { background: #00ffb3; }

  /* PRICING */
  .pricing-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 48px; max-width: 800px; margin-left: auto; margin-right: auto; }
  .price-card { background: var(--bg2); border: 1px solid var(--border); border-radius: 20px; padding: 36px; }
  .price-card.featured { border-color: rgba(0,229,160,0.3); background: linear-gradient(135deg, rgba(0,229,160,0.06), var(--bg2)); position: relative; overflow: hidden; }
  .price-card.featured::before { content: 'MOST POPULAR'; position: absolute; top: 16px; right: -24px; background: var(--green); color: #060a0f; font-size: 9px; font-weight: 800; letter-spacing: 0.15em; padding: 4px 36px; transform: rotate(45deg); font-family: var(--font-display); }
  .price-tier { font-size: 11px; letter-spacing: 0.2em; color: var(--muted); text-transform: uppercase; margin-bottom: 12px; }
  .price-amount { font-family: var(--font-display); font-size: 52px; font-weight: 800; color: var(--green); letter-spacing: -2px; line-height: 1; }
  .price-period { font-size: 14px; color: var(--muted); margin-top: 4px; }
  .price-features { margin: 24px 0; display: flex; flex-direction: column; gap: 12px; }
  .price-feat { display: flex; align-items: center; gap: 10px; font-size: 14px; color: var(--muted); }
  .price-feat::before { content: '✓'; color: var(--green); font-weight: 700; }
  .price-btn { width: 100%; padding: 14px; border-radius: 12px; font-family: var(--font-display); font-weight: 700; font-size: 14px; cursor: pointer; transition: all 0.2s; border: none; }
  .price-btn-outline { background: transparent; border: 1px solid var(--border) !important; color: var(--text); }
  .price-btn-outline:hover { border-color: rgba(0,229,160,0.4) !important; }
  .price-btn-solid { background: var(--green); color: #060a0f; }
  .price-btn-solid:hover { background: #00ffb3; transform: translateY(-1px); }

  /* FOOTER */
  .footer { border-top: 1px solid var(--border); padding: 40px; text-align: center; color: var(--muted); font-size: 13px; }
  .footer-logo { font-family: var(--font-display); font-size: 18px; color: var(--green); margin-bottom: 8px; font-weight: 800; }

  /* GLOW BG */
  .hero-glow { position: absolute; width: 600px; height: 600px; background: radial-gradient(circle, rgba(0,229,160,0.06) 0%, transparent 70%); pointer-events: none; top: -100px; right: -100px; border-radius: 50%; }

  @media (max-width: 900px) {
    .hero, .demo-grid { grid-template-columns: 1fr; }
    .features-grid { grid-template-columns: 1fr 1fr; }
    .pricing-grid { grid-template-columns: 1fr; }
    .nav-links { display: none; }
  }
`;

const DEMO_RESPONSES = {
  default: "TickrMind says: 🔴 NO TRADE. Setup lacks directional conviction — price is choppy with declining volume. Stand aside and wait for a clean A+ pattern to form.",
  tsla: "TickrMind says: 🟡 WAIT. TSLA confidence 42%. Price approaching $425 round number resistance. Wait for a confirmed breakout with volume before entering calls.",
  nvda: "TickrMind says: 🔴 NO TRADE. NVDA confidence 28%. EMAs are tangled, no clear trend alignment. Less than 90 minutes to close — disqualifier triggered.",
  spy: "TickrMind says: 🟡 WAIT. SPY confidence 58%. Ascending staircase pattern forming but volume declining on last 2 candles. Wait for volume confirmation.",
  qqq: "TickrMind says: 🟢 SIGNAL. QQQ confidence 78%. Bull flag breakout confirmed with volume surge above VWAP. Entry: $712.50, Stop: $709.00, Target: $718.00.",
};

function getResponse(msg: string): Message {
  const m = msg.toLowerCase();

  if (m.includes("tsla")) {
    return {
      role: "bot",
      text:
        "🔴 WAIT\n\nConfidence: 34%\n\nWhy TickrMind Said No:\n• Choppy price action\n• Weak momentum confirmation\n• Low-quality setup\n\nRecommendation:\nWait for cleaner confirmation before entering.",
    };
  }

  if (m.includes("nvda")) {
    return {
      role: "bot",
      text:
        "🟡 WAIT FOR PULLBACK\n\nConfidence: 82%\n\nWhy:\n• Strong 4H bias\n• Momentum intact\n• Better risk after retracement\n\nRecommendation:\nWait for pullback confirmation before entering.",
    };
  }

  return {
    role: "bot",
    text:
      "TickrMind says: WAIT. Current setup shows low confidence because confirmation is weak. Best action: stand aside until an A+ setup forms.",
  };
}

const tickerData = [
  { sym: "QQQ", price: "712.34", dir: "up", chg: "+1.2%" },
  { sym: "SPY", price: "741.80", dir: "up", chg: "+0.8%" },
  { sym: "NVDA", price: "228.45", dir: "down", chg: "-0.4%" },
  { sym: "TSLA", price: "426.90", dir: "up", chg: "+2.1%" },
  { sym: "AAPL", price: "301.55", dir: "down", chg: "-0.2%" },
  { sym: "AMD", price: "435.20", dir: "up", chg: "+1.5%" },
];

const CARDS = [
  { sym: "TSLA", verdict: "NO TRADE", cls: "verdict-no", conf: 32, color: "#ff4466", reasons: ["Choppy price action", "Less than 90 min to close", "Volume declining"], rec: "Stand aside. Wait for a cleaner A+ setup." },
  { sym: "QQQ", verdict: "CALL SIGNAL", cls: "verdict-go", conf: 78, color: "#00e5a0", reasons: ["Bull flag breakout", "Volume confirmed", "VWAP reclaim"], rec: "Entry $712.50 · Stop $709 · Target $718" },
  { sym: "SPY", verdict: "WAIT", cls: "verdict-wait", conf: 55, color: "#f5c842", reasons: ["Ascending staircase", "Volume declining", "Round number $742"], rec: "Setup developing — watch next candle." },
];

export default function TickrMindLanding() {
  const [cardIdx, setCardIdx] = useState(0);
  const [messages, setMessages] = useState<Message[]>([
  {
    role: "bot",
    text:
      "Ask me if a trade is worth entering. Example: Should I enter TSLA calls right now?",
  },
]);

const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setCardIdx(i => (i + 1) % CARDS.length), 3000);
    return () => clearInterval(t);
  }, []);

  const handleSend = () => {
  if (!input.trim()) return;

  const userMessage: Message = {
    role: "user",
    text: input,
  };

  const botReply: Message = getResponse(input);

  setMessages((prev) => [
    ...prev,
    userMessage,
    botReply,
  ]);

  setInput("");
};
  const card = CARDS[cardIdx];

  return (
    <>
      <style>{styles}</style>

      {/* NAV */}
      <nav className="nav">
        <div>
          <div className="nav-logo">TickrMind</div>
          <div className="nav-sub">The mind behind smarter trades.</div>
        </div>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#coach">AI Coach</a>
          <a href="#pricing">Pricing</a>
        </div>
        <button className="nav-cta">Join Beta</button>
      </nav>

      {/* TICKER */}
      <div className="ticker-wrap">
        <div className="ticker-inner">
          {[...tickerData, ...tickerData].map((t, i) => (
            <div key={i} className="ticker-item">
              <strong>{t.sym}</strong>
              <span>${t.price}</span>
              <span className={t.dir}>{t.chg}</span>
              <span style={{ color: "rgba(255,255,255,0.1)" }}>·</span>
            </div>
          ))}
        </div>
      </div>

      {/* HERO */}
      <section style={{ position: "relative", overflow: "hidden" }}>
        <div className="hero-glow" />
        <div className="hero">
          <div>
            <div className="hero-badge">⚡ AI Trading Coach — Now in Beta</div>
            <h1>Know when to <em>enter</em>, wait, or walk away.</h1>
            <p className="hero-sub">TickrMind grades every setup, explains the risk in plain English, and stops you from taking low-probability trades before they cost you.</p>
            <div className="hero-actions">
              <button className="btn-primary">Get Early Access</button>
              <button className="btn-ghost">View Live Demo</button>
            </div>
            <p className="hero-note">Options · Stocks · Futures · Crypto</p>
          </div>

          {/* Rotating Signal Card */}
          <div className="signal-card">
            <div className="sc-top">
              <div>
                <div className="sc-symbol">{card.sym}</div>
                <div className="sc-time">TickrMind AI · Live Analysis</div>
              </div>
              <div className={`sc-verdict ${card.cls}`}>{card.cls === "verdict-go" ? "🟢" : card.cls === "verdict-wait" ? "🟡" : "🔴"} {card.verdict}</div>
            </div>
            <div className="sc-conf-label">Confidence: <strong style={{ color: card.color }}>{card.conf}%</strong></div>
            <div className="sc-conf-bar">
              <div className="sc-conf-fill" style={{ width: `${card.conf}%`, background: card.color }} />
            </div>
            <div className="sc-reasons">
              {card.reasons.map((r, i) => (
                <div key={i} className="sc-reason reason-no">✗ {r}</div>
              ))}
            </div>
            <div className="sc-rec">
              <strong>TickrMind says:</strong> {card.rec}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="section">
        <div className="section-label">Why TickrMind</div>
        <h2 className="section-title">Built to stop bad trades<br />before they happen.</h2>
        <p className="section-sub">Signals are easy. Discipline is hard. TickrMind focuses on the decision.</p>
        <div className="features-grid">
          {[
            { icon: "🧠", title: "AI Trade Coach", text: "Ask whether to enter, wait, hold, or exit. Get plain-English reasoning built on 15+ years of pattern logic." },
            { icon: "🛡️", title: "No-Trade Protection", text: "TickrMind explains exactly why a setup should be skipped when conditions are weak or disqualifiers trigger." },
            { icon: "📈", title: "Performance Analytics", text: "Track P&L, profit factor, win rate, journal reasons, and equity curve with every trade logged automatically." },
            { icon: "⭐", title: "Setup Grading", text: "Every setup gets a confidence score, pattern classification, and risk context before you make a decision." },
            { icon: "📓", title: "Trade Journal", text: "Automatically log wins, losses, reasons, and patterns over time to build self-awareness and edge." },
            { icon: "⚡", title: "Live Alerts", text: "Receive actionable insights through the dashboard, Telegram, and upcoming push notifications." },
          ].map((f, i) => (
            <div key={i} className="feat">
              <div className="feat-icon">{f.icon}</div>
              <div className="feat-title">{f.title}</div>
              <div className="feat-text">{f.text}</div>
            </div>
          ))}
        </div>
      </section>

      {/* DEMO CHAT */}
      <section id="coach" className="section">
        <div className="demo-grid">
          <div>
            <div className="section-label">AI Coach Demo</div>
            <h2 className="section-title">Ask TickrMind anything about your trade.</h2>
            <p className="section-sub" style={{ marginTop: 16 }}>This demo shows how the AI coach responds to real trade questions with disciplined, structured guidance.</p>
            <div style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 12 }}>
              {["Should I enter TSLA calls right now?", "Should I close my SPY spread?", "Why did TickrMind reject NVDA?"].map((q, i) => (
                <div key={i} onClick={() => setInput(q)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 12, cursor: "pointer", fontSize: 14, color: "var(--muted)", transition: "all 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(0,229,160,0.3)"; e.currentTarget.style.color = "var(--text)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--muted)"; }}>
                  <span style={{ color: "var(--green)" }}>→</span> {q}
                </div>
              ))}
            </div>
          </div>

          <div className="chat-card">
            <div className="chat-header">
              <div className="chat-avatar">🤖</div>
              <div>
                <div className="chat-title">TickrMind Coach</div>
                <div className="chat-status">🟢 AI Coach Active</div>
              </div>
            </div>
            <div className="chat-messages">
              {messages.map((m, i) => (
                <div key={i} className={`msg msg-${m.role}`}>{m.text}</div>
              ))}
              {typing && <div className="msg msg-bot" style={{ color: "var(--muted)" }}>TickrMind is analyzing...</div>}
            </div>
            <div className="chat-input">
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSend()} placeholder="Ask: Should I enter QQQ calls?" />
              <button className="chat-send" onClick={handleSend}>→</button>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="section" style={{ textAlign: "center" }}>
        <div className="section-label">Pricing</div>
        <h2 className="section-title">Simple beta pricing.</h2>
        <p className="section-sub">Start with discipline. Upgrade when you're ready for more.</p>
        <div className="pricing-grid">
          {[
            { tier: "Pro", price: "$7.99", features: ["AI Trade Coach", "Setup grading & scoring", "Trade journal", "Telegram alerts", "Mobile dashboard"], featured: false },
            { tier: "Elite", price: "$14.99", features: ["Everything in Pro", "Position sizing coach", "Advanced analytics", "Futures & crypto signals", "Priority support"], featured: true },
          ].map((p, i) => (
            <div key={i} className={`price-card${p.featured ? " featured" : ""}`}>
              <div className="price-tier">{p.tier}</div>
              <div className="price-amount">{p.price}</div>
              <div className="price-period">per month · cancel anytime</div>
              <div className="price-features">
                {p.features.map((f, j) => <div key={j} className="price-feat">{f}</div>)}
              </div>
              <button className={`price-btn ${p.featured ? "price-btn-solid" : "price-btn-outline"}`} style={!p.featured ? { border: "1px solid var(--border)" } : {}}>
                Join Beta
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-logo">TickrMind</div>
        <div>© 2026 TickrMind. Not financial advice. Trade responsibly.</div>
      </footer>
    </>
  );
}
