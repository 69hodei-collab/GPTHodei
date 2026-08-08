'use client';

import { useMemo, useState } from 'react';

const areas = [
  { key: 'ventas', label: 'Ventas', icon: '↗' },
  { key: 'marketing', label: 'Marketing', icon: '◎' },
  { key: 'operaciones', label: 'Operaciones', icon: '⚙' },
  { key: 'administracion', label: 'Administración', icon: '▦' },
  { key: 'clientes', label: 'Atención al cliente', icon: '♡' },
  { key: 'datos', label: 'Datos y reporting', icon: '▥' },
];

const questions = [
  ['¿Cuántas tareas repetitivas realiza tu equipo cada semana?', ['Pocas', 'Bastantes', 'Muchas']],
  ['¿Cómo gestionáis actualmente los datos y los informes?', ['Principalmente manual', 'Mezcla de herramientas', 'Automatizado']],
  ['¿Qué nivel de uso de IA existe ya en la empresa?', ['Ninguno', 'Uso individual', 'Procesos integrados']],
];

export default function Home() {
  const [selected, setSelected] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(false);

  const score = useMemo(() => {
    const answerScore = Object.values(answers).reduce((sum, value) => sum + value, 0);
    return Math.min(94, 38 + selected.length * 7 + answerScore * 5);
  }, [selected, answers]);

  const toggle = (key) => setSelected((current) => current.includes(key) ? current.filter((item) => item !== key) : [...current, key]);

  return (
    <main className="shell">
      <nav className="nav">
        <div className="brand"><span className="brandMark">iH</span><span>iHodei <b>AI</b></span></div>
        <span className="navTag">Diagnóstico inteligente para empresas</span>
      </nav>

      <section className="hero">
        <div className="eyebrow">IA · AUTOMATIZACIÓN · PRODUCTIVIDAD</div>
        <h1>Descubre dónde puede la IA<br/><span>hacer crecer tu empresa.</span></h1>
        <p>En menos de 3 minutos analizamos tus procesos y te mostramos oportunidades concretas de automatización e inteligencia artificial.</p>
        <div className="heroStats">
          <div><strong>3 min</strong><small>para completar</small></div>
          <div><strong>100%</strong><small>personalizado</small></div>
          <div><strong>0 €</strong><small>diagnóstico inicial</small></div>
        </div>
      </section>

      <section className="panel">
        {!result ? <>
          <div className="step"><span>01</span><div><h2>¿Dónde quieres mejorar?</h2><p>Selecciona una o varias áreas de tu empresa.</p></div></div>
          <div className="areaGrid">
            {areas.map((area) => <button key={area.key} onClick={() => toggle(area.key)} className={selected.includes(area.key) ? 'area active' : 'area'}><i>{area.icon}</i><span>{area.label}</span><em>{selected.includes(area.key) ? '✓' : '+'}</em></button>)}
          </div>

          <div className="divider" />
          <div className="step"><span>02</span><div><h2>Cuéntanos cómo trabajáis</h2><p>Tres preguntas para estimar vuestro potencial.</p></div></div>
          <div className="questions">
            {questions.map(([question, options], qIndex) => <div className="question" key={question}><h3>{question}</h3><div>{options.map((option, index) => <button key={option} className={answers[qIndex] === index ? 'choice chosen' : 'choice'} onClick={() => setAnswers({...answers, [qIndex]: index})}>{option}</button>)}</div></div>)}
          </div>
          <button className="cta" disabled={!selected.length || Object.keys(answers).length < 3} onClick={() => setResult(true)}>Generar mi diagnóstico →</button>
        </> : <div className="result">
          <div className="score"><span>{score}</span><small>/100</small></div>
          <div><div className="eyebrow">DIAGNÓSTICO iHODEI AI</div><h2>Tu empresa tiene un potencial alto de automatización.</h2><p>Hemos detectado oportunidades prioritarias en <b>{selected.map(key => areas.find(a => a.key === key)?.label).join(', ')}</b>.</p></div>
          <div className="recommendations">
            <article><b>01</b><h3>Automatiza tareas repetitivas</h3><p>Conecta formularios, CRM, correo y procesos internos para reducir trabajo manual.</p></article>
            <article><b>02</b><h3>Introduce asistentes de IA</h3><p>Crea copilotos internos entrenados con el conocimiento y procesos de tu empresa.</p></article>
            <article><b>03</b><h3>Convierte datos en decisiones</h3><p>Centraliza indicadores y genera análisis accionables para dirección.</p></article>
          </div>
          <button className="cta">Quiero una sesión estratégica con iHodei →</button>
          <button className="reset" onClick={() => setResult(false)}>← Volver al diagnóstico</button>
        </div>}
      </section>
      <footer>iHodei · Inteligencia artificial aplicada a empresas · MVP 2026</footer>
    </main>
  );
}
