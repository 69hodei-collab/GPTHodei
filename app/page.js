"use client";

import { useMemo, useState } from "react";

const cases = {
  pulse: {
    label: "Pulso semanal",
    icon: "pulse",
    prompt: "Dame el pulso de la empresa esta semana",
    eyebrow: "VISIÓN EJECUTIVA",
    title: "Pulso semanal",
    score: "82",
    scoreLabel: "Índice de salud",
    summary: "La compañía mantiene tracción comercial. Dos señales requieren intervención: el pipeline enterprise se ha ralentizado y el margen previsto baja cuatro puntos por sobrecarga operativa.",
    recommendation: "Prioriza Atlas, revisa capacidad de Producto y protege el margen antes del comité del lunes.",
  },
  risks: {
    label: "Radar de riesgos",
    icon: "radar",
    prompt: "¿Qué riesgos debería atender en los próximos 30 días?",
    eyebrow: "SEÑALES TEMPRANAS",
    title: "Radar de riesgos",
    score: "3",
    scoreLabel: "Riesgos prioritarios",
    summary: "Hay un riesgo alto y dos medios. Atlas lleva 12 días sin actividad, Northstar reduce interacción un 38% y Phoenix concentra demasiadas horas sénior.",
    recommendation: "Activa una llamada ejecutiva con Atlas, crea un plan de recuperación para Northstar y reasigna 24 horas de Phoenix.",
  },
  cost: {
    label: "Equipo y coste",
    icon: "team",
    prompt: "¿Cuánto nos está costando el proyecto Phoenix esta semana?",
    eyebrow: "CAPACIDAD Y ECONOMÍA",
    title: "Equipo y coste",
    score: "€12,4K",
    scoreLabel: "Coste semanal Phoenix",
    summary: "Phoenix acumula 238 horas esta semana. El 31% corresponde a reuniones y coordinación; 46 horas están bloqueadas por dependencias externas.",
    recommendation: "Reduce dos reuniones recurrentes, desbloquea la integración de datos y mueve la revisión técnica a un formato asíncrono.",
  },
  devil: {
    label: "Abogado del diablo",
    icon: "shield",
    prompt: "Cuestiona la subida de precios como CFO, CMO, COO e inversor",
    eyebrow: "DECISION INTELLIGENCE",
    title: "Abogado del diablo",
    score: "4",
    scoreLabel: "Perspectivas activas",
    summary: "La subida de precios mejora margen, pero puede elevar churn en clientes pequeños y tensionar onboarding. Falta segmentación y una transición para contratos vigentes.",
    recommendation: "Aplica la subida a nuevos clientes enterprise, prueba dos paquetes y protege temporalmente las cuentas con menor adopción.",
  },
};

const kpis = [
  ["Ventas", "82%", "del objetivo mensual", "+6,4%", "positive"],
  ["Runway", "7,4 m", "con escenario base", "+0,3 m", "positive"],
  ["Margen previsto", "32,8%", "cierre de agosto", "−4,0 pt", "warning"],
  ["Decisiones abiertas", "3", "requieren dirección", "2 críticas", "warning"],
];

const risks = [
  ["Alto", "Oportunidad Atlas bloqueada", "12 días sin actividad · €180K ARR"],
  ["Medio", "Northstar reduce interacción", "−38% de actividad en 21 días"],
  ["Medio", "Margen bajo presión", "−4 puntos por sobrecarga operativa"],
];

const people = [
  ["LV", "Laura Vega", "Product Lead", "38 h", "€2.318"],
  ["DM", "Diego Martín", "Senior Engineer", "42 h", "€2.268"],
  ["SA", "Sara Alonso", "Data Analyst", "31 h", "€1.333"],
];

const objections = [
  ["CFO", "finance", "¿Qué ocurre con caja si el churn sube dos puntos?"],
  ["CMO", "megaphone", "¿Tenemos evidencia de que el mercado percibe más valor?"],
  ["COO", "operations", "¿Podemos cumplir la promesa premium sin aumentar capacidad?"],
  ["INVERSOR", "chart", "¿La mejora de margen compensa una adopción más lenta?"],
];

const actions = [
  [1, "Preparar comité de dirección", "Agenda + briefing · lunes 09:00", "calendar"],
  [2, "Reactivar oportunidad Atlas", "Borrador para CEO del cliente", "send"],
  [3, "Revisar capacidad de Phoenix", "24 h reasignables detectadas", "team"],
  [4, "Proteger margen de agosto", "3 medidas propuestas", "shield"],
];

const quickPrompts = [
  "Dame el pulso de la empresa",
  "¿Qué riesgo no estoy viendo?",
  "Coste del proyecto Phoenix",
  "Haz de abogado del diablo",
];

function Icon({ name, size = 20 }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };
  const icons = {
    pulse: <path d="M3 12h4l2.2-6 4.2 12 2.3-6H21" />,
    radar: <><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="M12 4v8l5.4-5.4"/></>,
    team: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></>,
    shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/></>,
    mic: <><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0 0 14 0M12 17v5"/></>,
    arrow: <path d="m9 18 6-6-6-6" />,
    spark: <><path d="m12 3-1.6 4.4L6 9l4.4 1.6L12 15l1.6-4.4L18 9l-4.4-1.6L12 3Z"/><path d="m5 16-.8 2.2L2 19l2.2.8L5 22l.8-2.2L8 19l-2.2-.8L5 16Z"/></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/></>,
    send: <><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></>,
    check: <path d="m5 12 4 4L19 6" />,
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></>,
    finance: <path d="M3 21h18M5 21V10h4v11M10 21V3h4v18M15 21v-7h4v7" />,
    megaphone: <><path d="m3 11 15-5v12L3 13v-2Z"/><path d="M11.6 16.4 13 21H8l-1.2-6"/></>,
    operations: <><circle cx="12" cy="12" r="3"/><path d="M19 12h3M2 12h3M12 2v3M12 19v3M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1M18.4 18.4l-2.1-2.1M7.7 7.7 5.6 5.6"/></>,
    chart: <><path d="M3 3v18h18"/><path d="m7 16 4-5 3 3 5-7"/></>,
    lock: <><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></>,
    dots: <><circle cx="5" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="19" cy="12" r="1" fill="currentColor" stroke="none"/></>,
  };
  return <svg {...common}>{icons[name] || icons.spark}</svg>;
}

function caseFromText(text) {
  const q = text.toLowerCase();
  if (q.includes("riesg") || q.includes("30 días")) return "risks";
  if (q.includes("cost") || q.includes("emplead") || q.includes("phoenix")) return "cost";
  if (q.includes("abogado") || q.includes("cfo") || q.includes("objec")) return "devil";
  return "pulse";
}

export default function Home() {
  const [active, setActive] = useState("pulse");
  const [query, setQuery] = useState("");
  const [lastQuery, setLastQuery] = useState(cases.pulse.prompt);
  const [thinking, setThinking] = useState(false);
  const [listening, setListening] = useState(false);
  const [done, setDone] = useState([]);
  const [toast, setToast] = useState("");
  const bars = useMemo(() => [58, 63, 66, 61, 72, 76, 82], []);
  const selected = cases[active];

  function notify(message) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2200);
  }

  function run(text) {
    const clean = text.trim();
    if (!clean || thinking) return;
    setQuery(clean);
    setThinking(true);
    window.setTimeout(() => {
      setActive(caseFromText(clean));
      setLastQuery(clean);
      setThinking(false);
    }, 650);
  }

  function choose(id) {
    setActive(id);
    setQuery(cases[id].prompt);
    setLastQuery(cases[id].prompt);
  }

  function startVoice() {
    if (listening) return;
    setListening(true);
    const Recognition = typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition);
    if (Recognition) {
      const recognition = new Recognition();
      recognition.lang = "es-ES";
      recognition.interimResults = false;
      recognition.onresult = (event) => {
        const text = event.results[0][0].transcript;
        setQuery(text);
        run(text);
      };
      recognition.onerror = () => notify("No pude escuchar con claridad. Prueba escribiendo.");
      recognition.onend = () => setListening(false);
      recognition.start();
      return;
    }
    window.setTimeout(() => {
      const demo = "¿Cuánto nos está costando el proyecto Phoenix esta semana?";
      setListening(false);
      run(demo);
      notify("Modo demo: consulta de voz simulada");
    }, 1300);
  }

  function prepare(id, title) {
    if (done.includes(id)) return;
    setDone((current) => [...current, id]);
    notify(`Acción preparada: ${title}`);
  }

  return (
    <main className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <header className="topbar">
        <div className="brand-lockup"><div className="brand-mark">iH</div><div><div className="brand-name">CEO Command Center</div><div className="brand-byline">BY iHODEI</div></div></div>
        <div className="topbar-center"><span className="live-dot"/><span>Datos actualizados hace 4 min</span><span className="topbar-divider"/><span className="demo-pill">ENTORNO DEMO</span></div>
        <div className="topbar-actions"><button className="icon-button" aria-label="Buscar"><Icon name="search"/></button><button className="icon-button has-notification" aria-label="Notificaciones"><Icon name="bell"/></button><button className="profile-button" aria-label="Perfil">MG</button></div>
      </header>

      <div className="workspace">
        <aside className="sidebar">
          <div className="sidebar-section-label">CASOS EJECUTIVOS</div>
          <nav className="sidebar-nav">{Object.entries(cases).map(([id, item]) => <button key={id} className={`nav-item ${active === id ? "active" : ""}`} onClick={() => choose(id)}><span className="nav-icon"><Icon name={item.icon} size={19}/></span><span>{item.label}</span>{active === id && <span className="nav-indicator"/>}</button>)}</nav>
          <div className="sidebar-divider"/>
          <div className="sidebar-section-label">FUENTES CONECTADAS</div>
          <div className="source-list">{["CRM comercial", "Finanzas", "Proyectos", "Calendario"].map((source) => <div className="source-item" key={source}><span className="source-status"/><span>{source}</span><span className="source-ok">OK</span></div>)}</div>
          <div className="privacy-card"><div className="privacy-icon"><Icon name="lock" size={18}/></div><div><strong>Entorno seguro</strong><span>Datos ficticios y trazables</span></div></div>
        </aside>

        <section className="content">
          <section className="hero-section"><div className="hero-copy"><p className="eyebrow">SÁBADO · 15 AGO 2026</p><h1>Buenos días, Manolo.</h1><p>Estas son las señales que merecen tu atención hoy.</p></div><div className="week-chip"><span>Semana 33</span><strong>10–16 agosto</strong></div></section>

          <form className={`command-bar ${listening ? "listening" : ""}`} onSubmit={(event) => { event.preventDefault(); run(query || selected.prompt); }}>
            <button className="voice-button" type="button" onClick={startVoice} aria-label="Hablar"><span className="voice-ripple ripple-one"/><span className="voice-ripple ripple-two"/><Icon name="mic" size={23}/></button>
            <div className="command-copy"><span className="command-label">{listening ? "TE ESCUCHO…" : "PREGUNTA AL COMMAND CENTER"}</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="¿Qué quieres decidir hoy?" aria-label="Consulta ejecutiva"/></div>
            <button className="ask-button" type="submit" disabled={thinking}>{thinking ? <span className="thinking-dots"><i/><i/><i/></span> : <>Analizar <Icon name="arrow" size={17}/></>}</button>
          </form>

          <div className="quick-prompts"><span>Prueba:</span>{quickPrompts.map((prompt) => <button key={prompt} onClick={() => run(prompt)}>{prompt}</button>)}</div>
          <section className="kpi-grid">{kpis.map(([label, value, detail, trend, tone]) => <article className="kpi-card" key={label}><div className="kpi-topline"><span>{label}</span><span className={`trend ${tone}`}>{trend}</span></div><strong>{value}</strong><p>{detail}</p></article>)}</section>

          <div className="dashboard-layout">
            <div className="dashboard-main">
              <section className="panel pulse-panel">
                <div className="panel-header"><div><span className="panel-kicker">PULSO SEMANAL</span><h2>La compañía mantiene tracción</h2></div><button className="small-icon-button" aria-label="Más"><Icon name="dots"/></button></div>
                <div className="pulse-content">
                  <div className="health-score"><div className="score-ring" style={{"--score":"82%"}}><div><strong>82</strong><span>/100</span></div></div><div className="score-copy"><span>Índice de salud</span><strong>Estable con alertas</strong><p>+5 puntos frente a la semana anterior</p></div></div>
                  <div className="spark-chart"><div className="chart-scale"><span>100</span><span>75</span><span>50</span></div><div className="bars">{bars.map((value, index) => <div className="bar-column" key={index}><div className="bar-track"><div className="bar-fill" style={{height:`${value}%`}}/></div><span>{["L","M","X","J","V","S","H"][index]}</span></div>)}</div></div>
                </div>
                <div className="signal-row"><div className="signal positive"><span className="signal-icon"><Icon name="chart" size={16}/></span><div><strong>Ventas aceleran</strong><p>+6,4% en siete días</p></div></div><div className="signal warning"><span className="signal-icon"><Icon name="radar" size={16}/></span><div><strong>Margen bajo presión</strong><p>−4 puntos previstos</p></div></div><button className="text-link" onClick={() => choose("pulse")}>Ver briefing <Icon name="arrow" size={14}/></button></div>
              </section>

              <div className="two-column-panels">
                <section className="panel risk-panel"><div className="panel-header compact"><div><span className="panel-kicker">RADAR DE RIESGOS</span><h3>Señales tempranas</h3></div><span className="risk-count">3</span></div><div className="risk-list">{risks.map(([severity,title,detail]) => <button className="risk-item" key={title} onClick={() => choose("risks")}><span className={`risk-severity ${severity.toLowerCase()}`}>{severity}</span><span className="risk-copy"><strong>{title}</strong><small>{detail}</small></span><Icon name="arrow" size={14}/></button>)}</div></section>
                <section className="panel cost-panel"><div className="panel-header compact"><div><span className="panel-kicker">COSTE POR EMPLEADO</span><h3>Proyecto Phoenix</h3></div><strong className="cost-total">€12,4K</strong></div><div className="cost-meta"><span><strong>238 h</strong> imputadas</span><span><strong>€52,18</strong> coste/hora</span><span className="cost-alert"><strong>31%</strong> coordinación</span></div><div className="employee-list">{people.map(([initials,name,role,hours,cost]) => <div className="employee-row" key={name}><span className="avatar">{initials}</span><span className="employee-copy"><strong>{name}</strong><span>{role}</span></span><span className="employee-hours"><strong>{hours}</strong><span>esta semana</span></span><span className="employee-cost">{cost}</span></div>)}</div><button className="secondary-button full" onClick={() => choose("cost")}>Ver coste completo <Icon name="arrow" size={14}/></button></section>
              </div>

              <section className={`panel answer-panel ${thinking ? "is-thinking" : ""}`}><div className="answer-orb"><Icon name="spark"/></div><div><div className="answer-header"><div><span className="panel-kicker">{selected.eyebrow}</span><h2>{selected.title}</h2></div><span className="generated-badge">GENERADO AHORA</span></div><div className="query-quote">“{lastQuery}”</div><div className="answer-grid"><div className="answer-summary"><span>LECTURA EJECUTIVA</span><p>{selected.summary}</p></div><div className="answer-score"><strong>{selected.score}</strong><span>{selected.scoreLabel}</span></div><div className="recommendation-box"><span><Icon name="spark" size={13}/> RECOMENDACIÓN</span><p>{selected.recommendation}</p></div></div><div className="answer-actions"><button className="primary-button" onClick={() => notify("Agenda y tareas preparadas para revisión")}><Icon name="calendar" size={15}/> Preparar seguimiento</button><button className="ghost-button" onClick={() => notify("Briefing copiado al portapapeles de la demo")}>Copiar briefing</button></div></div></section>
            </div>

            <aside className="dashboard-side">
              <section className="panel action-center"><div className="panel-header compact"><div><span className="panel-kicker">CENTRO DE ACCIÓN</span><h3>Siguiente mejor acción</h3></div><span className="action-progress">{done.length}/4</span></div><p className="action-intro">El sistema convierte cada señal en un paso listo para revisar.</p><div className="action-list">{actions.map(([id,title,meta,icon]) => <button key={id} className={`action-item ${done.includes(id) ? "done" : ""}`} onClick={() => prepare(id,title)}><span className="action-icon"><Icon name={done.includes(id) ? "check" : icon} size={15}/></span><span className="action-copy"><strong>{title}</strong><small>{done.includes(id) ? "Preparado para revisión" : meta}</small></span><Icon name="arrow" size={13}/></button>)}</div><button className="action-all-button" onClick={() => { setDone([1,2,3,4]); notify("Las cuatro acciones han quedado preparadas"); }}>Preparar todas</button></section>
              <section className="panel devil-panel"><div className="panel-header compact"><div><span className="panel-kicker">ABOGADO DEL DIABLO</span><h3>Subida de precios</h3></div><button className="small-icon-button" onClick={() => choose("devil")} aria-label="Abrir"><Icon name="arrow" size={16}/></button></div><p className="devil-intro">Cuatro perspectivas para tensionar la decisión antes del comité.</p><div className="objection-list">{objections.map(([role,icon,question]) => <div className="objection" key={role}><span className="role-icon"><Icon name={icon} size={14}/></span><div><strong>{role}</strong><p>{question}</p></div></div>)}</div><button className="secondary-button full" onClick={() => choose("devil")}>Simular objeciones <Icon name="arrow" size={14}/></button></section>
              <div className="next-meeting-card"><span className="meeting-icon"><Icon name="calendar" size={16}/></span><div><span>PRÓXIMA REUNIÓN</span><strong>Comité de dirección</strong><p>Lunes · 09:00 · 6 asistentes</p></div><span className="meeting-ready">Briefing listo</span></div>
            </aside>
          </div>

          <footer className="footer-note"><span><Icon name="lock" size={11}/> Demo con datos ficticios. Ninguna acción se ejecuta sin confirmación.</span><span>CEO Command Center · iHODEI</span></footer>
        </section>
      </div>
      {toast && <div className="toast"><span><Icon name="check" size={16}/></span>{toast}</div>}
    </main>
  );
}
