import { useEffect, useRef } from "react";

export default function Landing({ onGetStarted }) {

  useEffect(() => {
    // Custom cursor
    const cursor = document.getElementById("cursor");
    const ring = document.getElementById("cursorRing");
    const onMove = e => {
      cursor.style.left = e.clientX + "px";
      cursor.style.top  = e.clientY + "px";
      ring.style.left   = e.clientX + "px";
      ring.style.top    = e.clientY + "px";
    };
    document.addEventListener("mousemove", onMove);
    const interactables = document.querySelectorAll("a, button");
    interactables.forEach(el => {
      el.addEventListener("mouseenter", () => { cursor.classList.add("active"); ring.classList.add("active"); });
      el.addEventListener("mouseleave", () => { cursor.classList.remove("active"); ring.classList.remove("active"); });
    });

    // Navbar scroll
    const onScroll = () => {
      document.getElementById("navbar")?.classList.toggle("scrolled", window.scrollY > 60);
    };
    window.addEventListener("scroll", onScroll);

    // Particles
    const container = document.getElementById("particles");
    if (container) {
      for (let i = 0; i < 20; i++) {
        const p = document.createElement("div");
        p.className = "particle";
        p.style.cssText = `left:${Math.random()*100}%;width:${2+Math.random()*3}px;height:${2+Math.random()*3}px;animation-duration:${6+Math.random()*10}s;animation-delay:${Math.random()*8}s;`;
        container.appendChild(p);
      }
    }

    // Scroll reveal
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); });
    }, { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

    // Counter animation
    function animateCounter(el) {
      const target = parseInt(el.dataset.target);
      const suffix = el.dataset.suffix || "";
      const duration = 2000;
      const start = performance.now();
      const update = now => {
        const p = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(ease * target) + suffix;
        if (p < 1) requestAnimationFrame(update);
      };
      requestAnimationFrame(update);
    }
    const statObserver = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const num = e.target.querySelector(".stat-num");
          if (num && !num.dataset.animated) { num.dataset.animated = "true"; animateCounter(num); }
        }
      });
    }, { threshold: 0.5 });
    document.querySelectorAll(".stat-item").forEach(el => statObserver.observe(el));

    return () => {
      document.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
      revealObserver.disconnect();
      statObserver.disconnect();
    };
  }, []);

  return (
    <>
      <style>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        :root{
          --ink:#0a1a0d;--leaf:#1a6b35;--leaf2:#2d9e58;--lime:#b5e550;--lime2:#d4f06a;
          --cream:#f5f2e8;--cream2:#ede9d8;--muted:#4a6b52;--muted2:#7a9b82;
          --white:#ffffff;--border:rgba(26,107,53,0.12);
        }
        html{scroll-behavior:smooth}
        body{font-family:'Cabinet Grotesk',sans-serif;background:var(--cream);color:var(--ink);overflow-x:hidden;cursor:none}
        .cursor{position:fixed;width:10px;height:10px;background:var(--leaf);border-radius:50%;pointer-events:none;z-index:9999;transform:translate(-50%,-50%);transition:transform 0.1s,width 0.3s,height 0.3s,background 0.3s}
        .cursor-ring{position:fixed;width:36px;height:36px;border:1.5px solid var(--leaf);border-radius:50%;pointer-events:none;z-index:9998;transform:translate(-50%,-50%);transition:transform 0.12s ease,width 0.3s,height 0.3s,border-color 0.3s;transition-delay:0.04s}
        .cursor.active{width:6px;height:6px;background:var(--lime)}
        .cursor-ring.active{width:48px;height:48px;border-color:var(--lime2)}
        nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:20px 48px;display:flex;align-items:center;justify-content:space-between;transition:all 0.4s}
        nav.scrolled{background:rgba(245,242,232,0.92);backdrop-filter:blur(16px);border-bottom:1px solid var(--border);padding:14px 48px}
        .nav-logo{display:flex;align-items:center;gap:10px}
        .nav-logo-mark{width:36px;height:36px;background:var(--leaf);border-radius:10px;display:flex;align-items:center;justify-content:center}
        .nav-logo-text{font-size:20px;font-weight:900;color:var(--ink);letter-spacing:-0.5px}
        .nav-logo-text span{color:var(--leaf)}
        .nav-links{display:flex;align-items:center;gap:36px}
        .nav-links a{font-size:14px;font-weight:500;color:var(--muted);text-decoration:none;transition:color 0.2s}
        .nav-links a:hover{color:var(--ink)}
        .nav-cta{padding:10px 22px;background:var(--ink);color:var(--cream);border-radius:100px;font-size:14px;font-weight:700;text-decoration:none;transition:all 0.2s;letter-spacing:-0.2px}
        .nav-cta:hover{background:var(--leaf);transform:translateY(-1px)}
        .hero{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:120px 48px 80px;position:relative;overflow:hidden}
        .hero-bg{position:absolute;inset:0;z-index:0}
        .hero-orb{position:absolute;border-radius:50%;filter:blur(80px)}
        .hero-orb-1{width:700px;height:700px;background:radial-gradient(circle,rgba(181,229,80,0.25) 0%,transparent 70%);top:-200px;left:-200px;animation:drift1 12s ease-in-out infinite}
        .hero-orb-2{width:500px;height:500px;background:radial-gradient(circle,rgba(26,107,53,0.2) 0%,transparent 70%);bottom:-100px;right:-100px;animation:drift2 15s ease-in-out infinite}
        .hero-orb-3{width:300px;height:300px;background:radial-gradient(circle,rgba(181,229,80,0.15) 0%,transparent 70%);top:40%;right:15%;animation:drift3 10s ease-in-out infinite}
        @keyframes drift1{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(40px,30px) scale(1.05)}}
        @keyframes drift2{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-30px,-40px) scale(1.08)}}
        @keyframes drift3{0%,100%{transform:translate(0,0)}50%{transform:translate(20px,-25px)}}
        .particles{position:absolute;inset:0}
        .particle{position:absolute;width:3px;height:3px;border-radius:50%;background:var(--leaf);opacity:0;animation:particleFloat linear infinite}
        @keyframes particleFloat{0%{opacity:0;transform:translateY(100%) scale(0)}20%{opacity:0.6}80%{opacity:0.3}100%{opacity:0;transform:translateY(-80vh) scale(1.5) rotate(180deg)}}
        .hero-content{position:relative;z-index:1;max-width:920px}
        .hero-badge{display:inline-flex;align-items:center;gap:8px;background:rgba(26,107,53,0.08);border:1px solid rgba(26,107,53,0.2);border-radius:100px;padding:7px 16px;margin-bottom:32px;animation:fadeUp 0.8s ease both}
        .hero-badge-dot{width:7px;height:7px;border-radius:50%;background:var(--leaf2);animation:pulse 2s infinite}
        @keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(45,158,88,0.4)}50%{box-shadow:0 0 0 6px rgba(45,158,88,0)}}
        .hero-badge span{font-size:12px;font-weight:700;color:var(--leaf);letter-spacing:0.6px;text-transform:uppercase}
        .hero-h1{font-family:'Instrument Serif',serif;font-size:clamp(56px,8vw,104px);line-height:1.0;letter-spacing:-2px;color:var(--ink);margin-bottom:24px;animation:fadeUp 0.8s ease 0.1s both}
        .hero-h1 em{font-style:italic;color:var(--leaf)}
        .hero-h1 .highlight{position:relative;display:inline-block}
        .hero-h1 .highlight::after{content:'';position:absolute;bottom:4px;left:0;right:0;height:4px;background:var(--lime);border-radius:2px;transform:scaleX(0);transform-origin:left;animation:underlineReveal 0.8s ease 1s both}
        @keyframes underlineReveal{to{transform:scaleX(1)}}
        .hero-sub{font-size:18px;color:var(--muted);line-height:1.7;max-width:560px;margin:0 auto 40px;font-weight:400;animation:fadeUp 0.8s ease 0.2s both}
        .hero-actions{display:flex;align-items:center;gap:16px;justify-content:center;animation:fadeUp 0.8s ease 0.3s both}
        .btn-primary{padding:16px 36px;background:var(--ink);color:var(--cream);border-radius:100px;font-size:16px;font-weight:700;text-decoration:none;transition:all 0.3s;letter-spacing:-0.3px;display:inline-flex;align-items:center;gap:8px}
        .btn-primary:hover{background:var(--leaf);transform:translateY(-2px);box-shadow:0 12px 32px rgba(26,107,53,0.3)}
        .btn-primary svg{transition:transform 0.3s}
        .btn-primary:hover svg{transform:translate(3px,-3px)}
        .btn-secondary{padding:16px 32px;background:transparent;color:var(--ink);border:1.5px solid rgba(10,26,13,0.2);border-radius:100px;font-size:16px;font-weight:600;text-decoration:none;transition:all 0.2s;letter-spacing:-0.3px}
        .btn-secondary:hover{border-color:var(--leaf);color:var(--leaf)}
        .scroll-hint{position:absolute;bottom:40px;left:50%;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:8px;animation:fadeUp 1s ease 0.8s both;opacity:0.5}
        .scroll-hint span{font-size:11px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:var(--muted)}
        .scroll-line{width:1px;height:48px;background:linear-gradient(to bottom,var(--leaf),transparent);animation:scrollAnim 1.5s ease-in-out infinite}
        @keyframes scrollAnim{0%{transform:scaleY(0);transform-origin:top}50%{transform:scaleY(1);transform-origin:top}51%{transform:scaleY(1);transform-origin:bottom}100%{transform:scaleY(0);transform-origin:bottom}}
        .ticker-wrap{background:var(--leaf);padding:14px 0;overflow:hidden}
        .ticker{display:flex;animation:ticker 25s linear infinite;white-space:nowrap}
        .ticker-item{display:inline-flex;align-items:center;gap:12px;padding:0 32px;font-size:13px;font-weight:700;color:var(--lime2);letter-spacing:0.4px;text-transform:uppercase}
        .ticker-dot{width:5px;height:5px;border-radius:50%;background:var(--lime);flex-shrink:0}
        @keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
        .stats-strip{padding:80px 48px;display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:var(--border);border-top:1px solid var(--border);border-bottom:1px solid var(--border)}
        .stat-item{background:var(--cream);padding:40px 32px;text-align:center;transition:background 0.3s}
        .stat-item:hover{background:var(--cream2)}
        .stat-num{font-family:'Instrument Serif',serif;font-size:56px;color:var(--leaf);line-height:1;letter-spacing:-2px;margin-bottom:8px}
        .stat-label{font-size:14px;color:var(--muted);font-weight:500}
        .features-section{padding:120px 48px;max-width:1280px;margin:0 auto}
        .section-label{display:inline-flex;align-items:center;gap:8px;font-size:12px;font-weight:700;color:var(--leaf);letter-spacing:1px;text-transform:uppercase;margin-bottom:20px}
        .section-label::before{content:'';width:24px;height:2px;background:var(--leaf);border-radius:1px}
        .section-h2{font-family:'Instrument Serif',serif;font-size:clamp(40px,5vw,64px);color:var(--ink);line-height:1.1;letter-spacing:-1.5px;margin-bottom:64px;max-width:640px}
        .section-h2 em{font-style:italic;color:var(--leaf)}
        .features-grid{display:grid;grid-template-columns:1fr 1fr;gap:2px;background:var(--border);border:1px solid var(--border)}
        .feature-card{background:var(--cream);padding:48px 44px;transition:all 0.3s;position:relative;overflow:hidden}
        .feature-card::before{content:'';position:absolute;top:0;left:0;width:3px;height:0;background:var(--lime);transition:height 0.4s ease}
        .feature-card:hover{background:var(--cream2)}
        .feature-card:hover::before{height:100%}
        .feature-icon{width:52px;height:52px;border-radius:14px;background:rgba(26,107,53,0.08);border:1px solid rgba(26,107,53,0.15);display:flex;align-items:center;justify-content:center;margin-bottom:20px;font-size:24px}
        .feature-h3{font-size:22px;font-weight:800;color:var(--ink);margin-bottom:10px;letter-spacing:-0.4px}
        .feature-p{font-size:15px;color:var(--muted);line-height:1.7}
        .wise-section{padding:120px 48px;background:var(--ink);position:relative;overflow:hidden}
        .wise-bg-circle{position:absolute;border-radius:50%;background:radial-gradient(circle,rgba(181,229,80,0.08) 0%,transparent 70%)}
        .wise-grid{max-width:1280px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center;position:relative;z-index:1}
        .wise-label{font-size:12px;font-weight:700;color:var(--lime);letter-spacing:1px;text-transform:uppercase;margin-bottom:20px;display:flex;align-items:center;gap:8px}
        .wise-label::before{content:'';width:24px;height:2px;background:var(--lime);border-radius:1px}
        .wise-h2{font-family:'Instrument Serif',serif;font-size:clamp(36px,4vw,58px);color:var(--cream);line-height:1.1;letter-spacing:-1.5px;margin-bottom:24px}
        .wise-h2 em{font-style:italic;color:var(--lime)}
        .wise-p{font-size:16px;color:rgba(245,242,232,0.55);line-height:1.8;margin-bottom:36px}
        .wise-steps{display:flex;flex-direction:column;gap:20px}
        .wise-step{display:flex;align-items:flex-start;gap:16px;padding:20px;border-radius:12px;border:1px solid rgba(245,242,232,0.07);transition:all 0.3s}
        .wise-step:hover{background:rgba(245,242,232,0.04);border-color:rgba(181,229,80,0.2)}
        .wise-step-num{width:32px;height:32px;border-radius:9px;background:rgba(181,229,80,0.12);border:1px solid rgba(181,229,80,0.2);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;color:var(--lime);flex-shrink:0}
        .wise-step-title{font-size:14px;font-weight:700;color:var(--cream);margin-bottom:4px}
        .wise-step-desc{font-size:13px;color:rgba(245,242,232,0.45);line-height:1.6}
        .r3bin-visual{position:relative;height:480px;display:flex;align-items:center;justify-content:center}
        .r3bin-ring{position:absolute;border-radius:50%;border:1px solid;animation:spinRing linear infinite}
        .r3bin-core{width:140px;height:140px;border-radius:50%;background:linear-gradient(135deg,var(--lime),var(--leaf2));display:flex;align-items:center;justify-content:center;flex-direction:column;gap:4px;box-shadow:0 0 60px rgba(181,229,80,0.3),0 0 120px rgba(181,229,80,0.1);position:relative;z-index:2}
        .r3bin-core-label{font-size:22px;font-weight:900;color:var(--ink);letter-spacing:-0.5px}
        .r3bin-core-sub{font-size:10px;font-weight:700;color:rgba(10,26,13,0.6);letter-spacing:1px;text-transform:uppercase}
        .r3bin-node{position:absolute;width:44px;height:44px;border-radius:50%;background:var(--ink);border:2px solid;display:flex;align-items:center;justify-content:center;font-size:18px;z-index:3}
        @keyframes spinRing{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        .waste-section{padding:120px 48px;max-width:1280px;margin:0 auto}
        .waste-cards{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-top:64px}
        .waste-card{border-radius:20px;padding:32px 28px;position:relative;overflow:hidden;cursor:pointer;transition:transform 0.3s}
        .waste-card:hover{transform:translateY(-6px)}
        .waste-card-icon{font-size:40px;margin-bottom:16px;display:block}
        .waste-card-title{font-size:20px;font-weight:800;letter-spacing:-0.4px;margin-bottom:8px}
        .waste-card-desc{font-size:14px;line-height:1.6;opacity:0.7}
        .waste-card-tag{display:inline-block;padding:4px 12px;border-radius:100px;font-size:11px;font-weight:700;letter-spacing:0.5px;text-transform:uppercase;margin-top:20px;background:rgba(255,255,255,0.2)}
        .waste-card.dry{background:linear-gradient(135deg,#f59e0b,#d97706);color:white}
        .waste-card.wet{background:linear-gradient(135deg,#38bdf8,#0ea5e9);color:white}
        .waste-card.recyclable{background:linear-gradient(135deg,#22c55e,#16a34a);color:white}
        .waste-card.hazardous{background:linear-gradient(135deg,#f87171,#ef4444);color:white}
        .waste-card::after{content:'';position:absolute;top:-40px;right:-40px;width:120px;height:120px;border-radius:50%;background:rgba(255,255,255,0.1)}
        .impact-section{background:var(--cream2);border-top:1px solid var(--border);border-bottom:1px solid var(--border);padding:120px 48px}
        .impact-inner{max-width:1280px;margin:0 auto}
        .impact-quote{font-family:'Instrument Serif',serif;font-size:clamp(28px,3.5vw,48px);color:var(--ink);line-height:1.25;letter-spacing:-1px;max-width:800px;margin-bottom:40px}
        .impact-quote em{color:var(--leaf);font-style:italic}
        .impact-author{display:flex;align-items:center;gap:16px}
        .impact-avatar{width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg,var(--leaf),var(--leaf2));display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:800;color:white}
        .impact-name{font-size:15px;font-weight:700;color:var(--ink)}
        .impact-role{font-size:13px;color:var(--muted);margin-top:2px}
        .cta-section{padding:140px 48px;text-align:center;position:relative;overflow:hidden}
        .cta-bg{position:absolute;inset:0;background:radial-gradient(ellipse at center,rgba(181,229,80,0.12) 0%,transparent 70%);pointer-events:none}
        .cta-h2{font-family:'Instrument Serif',serif;font-size:clamp(44px,6vw,80px);color:var(--ink);line-height:1.05;letter-spacing:-2px;margin-bottom:24px}
        .cta-h2 em{font-style:italic;color:var(--leaf)}
        .cta-p{font-size:18px;color:var(--muted);margin-bottom:48px;max-width:480px;margin-left:auto;margin-right:auto;line-height:1.7}
        .cta-actions{display:flex;align-items:center;justify-content:center;gap:16px}
        footer{background:var(--ink);padding:64px 48px 40px;color:rgba(245,242,232,0.4)}
        .footer-top{display:grid;grid-template-columns:1.5fr 1fr 1fr 1fr;gap:48px;margin-bottom:64px}
        .footer-brand-p{font-size:14px;line-height:1.7;color:rgba(245,242,232,0.4);margin-top:16px;max-width:260px}
        .footer-col h4{font-size:12px;font-weight:700;color:rgba(245,242,232,0.3);letter-spacing:1px;text-transform:uppercase;margin-bottom:20px}
        .footer-col a{display:block;font-size:14px;color:rgba(245,242,232,0.5);text-decoration:none;margin-bottom:10px;transition:color 0.2s;font-weight:500}
        .footer-col a:hover{color:var(--lime)}
        .footer-bottom{border-top:1px solid rgba(245,242,232,0.07);padding-top:28px;display:flex;align-items:center;justify-content:space-between}
        .footer-bottom p{font-size:13px}
        .footer-wise{font-size:13px;color:rgba(245,242,232,0.25)}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        .reveal{opacity:0;transform:translateY(28px);transition:opacity 0.7s ease,transform 0.7s ease}
        .reveal.visible{opacity:1;transform:translateY(0)}
        .reveal-delay-1{transition-delay:0.1s}
        .reveal-delay-2{transition-delay:0.2s}
        .reveal-delay-3{transition-delay:0.3s}
      `}</style>

      <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Cabinet+Grotesk:wght@400;500;700;800;900&display=swap" rel="stylesheet" />

      <div className="cursor" id="cursor" />
      <div className="cursor-ring" id="cursorRing" />

      {/* NAV */}
      <nav id="navbar">
        <div className="nav-logo">
          <div className="nav-logo-mark">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M17.66 8L12 2.35 6.34 8C4.78 9.56 4 11.64 4 13.64c0 2 .78 4.04 2.34 5.6 1.56 1.56 3.61 2.36 5.66 2.36s4.1-.79 5.66-2.36C19.22 17.68 20 15.64 20 13.64c0-2-.78-4.08-2.34-5.64z"/>
            </svg>
          </div>
          <span className="nav-logo-text">Fos<span>tride</span></span>
        </div>
        <div className="nav-links">
          <a href="#wise">W.I.S.E.</a>
          <a href="#features">Features</a>
          <a href="#waste">Waste Types</a>
          <a href="#impact">Impact</a>
        </div>
        <a href="#" className="nav-cta" onClick={e => { e.preventDefault(); onGetStarted(); }}>Get Started →</a>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-orb hero-orb-1" />
          <div className="hero-orb hero-orb-2" />
          <div className="hero-orb hero-orb-3" />
          <div className="particles" id="particles" />
        </div>
        <div className="hero-content">
          <div className="hero-badge">
            <div className="hero-badge-dot" />
            <span>Introducing W.I.S.E. by Fostride</span>
          </div>
          <h1 className="hero-h1">
            Waste that's<br/>
            <em>sorted</em> by<br/>
            <span className="highlight">intelligence.</span>
          </h1>
          <p className="hero-sub">
            AI-powered waste sorting that transforms how cities, campuses, and buildings understand, manage, and reduce waste — in real time.
          </p>
          <div className="hero-actions">
            <a href="#" className="btn-primary" onClick={e => { e.preventDefault(); onGetStarted(); }}>
              Launch Dashboard
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
            </a>
            <a href="#wise" className="btn-secondary">See how it works</a>
          </div>
        </div>
        <div className="scroll-hint">
          <span>Scroll</span>
          <div className="scroll-line" />
        </div>
      </section>

      {/* TICKER */}
      <div className="ticker-wrap">
        <div className="ticker">
          {["AI-Powered Sorting","Real-Time Analytics","ESG Compliance","R3Bin Interface","Zero Waste Vision","Smart Infrastructure","Climate Action","Data-Driven Decisions",
            "AI-Powered Sorting","Real-Time Analytics","ESG Compliance","R3Bin Interface","Zero Waste Vision","Smart Infrastructure","Climate Action","Data-Driven Decisions"
          ].map((item, i) => (
            <span key={i} className="ticker-item"><span className="ticker-dot" />{item}</span>
          ))}
        </div>
      </div>

      {/* STATS */}
      <div className="stats-strip">
        {[
          { target:94, suffix:"%",  label:"Sorting Accuracy"      },
          { target:3,  suffix:"x",  label:"Faster Than Manual"    },
          { target:60, suffix:"%",  label:"Landfill Diversion"    },
          { target:24, suffix:"/7", label:"Real-Time Monitoring"  },
        ].map((s,i) => (
          <div key={i} className={`stat-item reveal${i>0?` reveal-delay-${i}`:""}`}>
            <div className="stat-num" data-target={s.target} data-suffix={s.suffix}>0</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* FEATURES */}
      <section className="features-section" id="features">
        <div className="section-label reveal">Platform Features</div>
        <h2 className="section-h2 reveal">Everything waste management <em>needs.</em></h2>
        <div className="features-grid reveal">
          {[
            { icon:"🧠", title:"AI Waste Recognition",      desc:"Computer vision and ML models trained on thousands of waste types identify and classify materials instantly at the point of disposal." },
            { icon:"📡", title:"Real-Time Data Streams",    desc:"Every disposal event is logged, timestamped, and streamed live to your dashboard — zero latency, zero guesswork." },
            { icon:"📊", title:"ESG Reporting Engine",      desc:"Auto-generate compliance reports, carbon footprint estimates, and sustainability scorecards aligned with global ESG frameworks." },
            { icon:"🔁", title:"Circular Economy Insights", desc:"Identify recyclable material streams, optimize collection schedules, and connect with certified recyclers in your network." },
          ].map((f,i) => (
            <div key={i} className="feature-card">
              <div className="feature-icon">{f.icon}</div>
              <h3 className="feature-h3">{f.title}</h3>
              <p className="feature-p">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WISE */}
      <section className="wise-section" id="wise">
        <div className="wise-bg-circle" style={{width:600,height:600,top:-200,right:-200}} />
        <div className="wise-bg-circle" style={{width:400,height:400,bottom:-100,left:-100}} />
        <div className="wise-grid">
          <div>
            <div className="wise-label reveal">The Engine</div>
            <h2 className="wise-h2 reveal">Meet <em>W.I.S.E.</em> — Waste Intelligent Sorting Engine</h2>
            <p className="wise-p reveal">The AI intelligence layer that sits at the heart of every R3Bin deployment. W.I.S.E. doesn't just collect data — it understands it, acts on it, and makes your waste ecosystem smarter over time.</p>
            <div className="wise-steps">
              {[
                { num:"01", title:"Capture",     desc:"R3Bin sensors capture waste data at the point of disposal using computer vision and weight sensors." },
                { num:"02", title:"Classify",    desc:"W.I.S.E. classifies waste into dry, wet, recyclable, or hazardous categories with 94% accuracy." },
                { num:"03", title:"Communicate", desc:"Data streams to your dashboard in real-time, building a connected waste intelligence ecosystem." },
              ].map((s,i) => (
                <div key={i} className={`wise-step reveal${i>0?` reveal-delay-${i}`:""}`}>
                  <div className="wise-step-num">{s.num}</div>
                  <div>
                    <div className="wise-step-title">{s.title}</div>
                    <div className="wise-step-desc">{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* R3BIN Visual */}
          <div className="r3bin-visual reveal">
            <div className="r3bin-ring" style={{width:380,height:380,borderColor:"rgba(181,229,80,0.12)",animationDuration:"30s"}} />
            <div className="r3bin-ring" style={{width:290,height:290,borderColor:"rgba(181,229,80,0.18)",animationDuration:"20s",animationDirection:"reverse"}} />
            <div className="r3bin-ring" style={{width:210,height:210,borderColor:"rgba(181,229,80,0.25)",animationDuration:"14s"}} />
            <div className="r3bin-core">
              <div className="r3bin-core-label">R3Bin</div>
              <div className="r3bin-core-sub">W.I.S.E.</div>
            </div>
            <div className="r3bin-node" style={{borderColor:"#f59e0b",top:32,left:"50%",transform:"translateX(-50%)"}}>🟡</div>
            <div className="r3bin-node" style={{borderColor:"#38bdf8",right:20,top:"50%",transform:"translateY(-50%)"}}>💧</div>
            <div className="r3bin-node" style={{borderColor:"#22c55e",bottom:32,left:"50%",transform:"translateX(-50%)"}}>♻️</div>
            <div className="r3bin-node" style={{borderColor:"#f87171",left:20,top:"50%",transform:"translateY(-50%)"}}>⚠️</div>
          </div>
        </div>
      </section>

      {/* WASTE TYPES */}
      <section className="waste-section" id="waste">
        <div className="section-label reveal">Waste Classification</div>
        <h2 className="section-h2 reveal">Four types.<br/><em>Infinite impact.</em></h2>
        <div className="waste-cards">
          {[
            { cls:"dry",        icon:"🟡", title:"Dry Waste",    desc:"Paper, cardboard, plastics, and non-organic materials sorted for efficient processing.",        tag:"Processable" },
            { cls:"wet",        icon:"💧", title:"Wet Waste",    desc:"Food scraps and organic matter routed to composting and biogas generation facilities.",        tag:"Compostable" },
            { cls:"recyclable", icon:"♻️", title:"Recyclable",   desc:"Glass, metals, and clean plastics directed to certified recycling partners for circular reuse.", tag:"Circular"    },
            { cls:"hazardous",  icon:"⚠️", title:"Hazardous",    desc:"Chemicals, batteries, and e-waste flagged for specialized safe disposal protocols.",           tag:"Controlled"  },
          ].map((w,i) => (
            <div key={i} className={`waste-card ${w.cls} reveal${i>0?` reveal-delay-${i}`:""}`}>
              <span className="waste-card-icon">{w.icon}</span>
              <div className="waste-card-title">{w.title}</div>
              <div className="waste-card-desc">{w.desc}</div>
              <span className="waste-card-tag">{w.tag}</span>
            </div>
          ))}
        </div>
      </section>

      {/* IMPACT */}
      <section className="impact-section" id="impact">
        <div className="impact-inner">
          <p className="impact-quote reveal">
            "Fostride's W.I.S.E. platform didn't just improve our waste numbers — it gave us <em>visibility we never had</em> into how our campus generates and manages waste."
          </p>
          <div className="impact-author reveal reveal-delay-1">
            <div className="impact-avatar">FR</div>
            <div>
              <div className="impact-name">W.I.S.E</div>
              <div className="impact-role">Founder, Fostride · Somaiya Vidyavihar University</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-bg" />
        <h2 className="cta-h2 reveal">Ready to sort<br/>the <em>future?</em></h2>
        <p className="cta-p reveal reveal-delay-1">Join Fostride and deploy W.I.S.E. intelligence across your campus, building, or city.</p>
        <div className="cta-actions reveal reveal-delay-2">
          <a href="#" className="btn-primary" onClick={e => { e.preventDefault(); onGetStarted(); }}>
            Launch Dashboard
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
          </a>
          <a href="#wise" className="btn-secondary">Learn more</a>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-top">
          <div>
            <div className="nav-logo">
              <div className="nav-logo-mark">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M17.66 8L12 2.35 6.34 8C4.78 9.56 4 11.64 4 13.64c0 2 .78 4.04 2.34 5.6 1.56 1.56 3.61 2.36 5.66 2.36s4.1-.79 5.66-2.36C19.22 17.68 20 15.64 20 13.64c0-2-.78-4.08-2.34-5.64z"/></svg>
              </div>
              <span className="nav-logo-text" style={{color:"#f5f2e8"}}>Fos<span style={{color:"#b5e550"}}>tride</span></span>
            </div>
            <p className="footer-brand-p">Transforming waste management through AI-powered intelligence, one bin at a time.</p>
          </div>
          {[
            { title:"Platform", links:["W.I.S.E. Engine","R3Bin Interface","Dashboard","Analytics"] },
            { title:"Company",  links:["About","Careers","Press","Contact"] },
            { title:"Legal",    links:["Privacy","Terms","ESG Policy"] },
          ].map((col,i) => (
            <div key={i} className="footer-col">
              <h4>{col.title}</h4>
              {col.links.map((l,j) => <a key={j} href="#">{l}</a>)}
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <p>© 2026 Fostride. Incubated at riidl, Somaiya Vidyavihar University.</p>
          <span className="footer-wise">W.I.S.E. — Waste Intelligent Sorting Engine</span>
        </div>
      </footer>
    </>
  );
}