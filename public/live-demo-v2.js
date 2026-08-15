(() => {
  const euro = new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  });

  const text = (node, value) => {
    if (node && value !== undefined && value !== null) node.textContent = String(value);
  };

  const compactEuro = (value) => {
    const amount = Number(value || 0);
    return amount >= 1000
      ? `€${(amount / 1000).toLocaleString("es-ES", { maximumFractionDigits: 1 })}K`
      : euro.format(amount);
  };

  const initials = (name) => String(name || "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  function renderKpis(metrics) {
    const byKey = new Map(metrics.map((item) => [item.metric_key, item]));
    const keys = ["sales_target", "runway", "forecast_margin", "open_decisions"];
    document.querySelectorAll(".kpi-card").forEach((card, index) => {
      const item = byKey.get(keys[index]);
      if (!item) return;
      text(card.querySelector(".kpi-topline > span:first-child"), item.label);
      text(card.querySelector(":scope > strong"), item.display_value);
      const trend = card.querySelector(".trend");
      text(trend, item.trend_display);
      if (trend) trend.className = `trend ${item.tone}`;
    });

    const health = byKey.get("company_health");
    if (health) {
      text(document.querySelector(".score-ring strong"), Math.round(Number(health.value)));
      text(document.querySelector(".score-copy p"), `${health.trend_display} frente a la semana anterior`);
    }
  }

  function renderHealth(snapshots) {
    const fills = document.querySelectorAll(".bar-fill");
    snapshots.forEach((snapshot, index) => {
      if (fills[index]) fills[index].style.height = `${snapshot.health_score}%`;
    });
  }

  function renderRisks(risks) {
    const labels = { high: "Alto", medium: "Medio", low: "Bajo" };
    const classes = { high: "alto", medium: "medio", low: "bajo" };
    document.querySelectorAll(".risk-item").forEach((row, index) => {
      const item = risks[index];
      if (!item) return;
      const severity = row.querySelector(".risk-severity");
      text(severity, labels[item.severity] || item.severity);
      if (severity) severity.className = `risk-severity ${classes[item.severity] || "medio"}`;
      text(row.querySelector(".risk-copy strong"), item.title);
      text(row.querySelector(".risk-copy small"), item.detail);
    });
  }

  function renderCosts(costRows, employees, entries) {
    const cost = costRows.find((item) => item.project_id === "phoenix") || costRows[0];
    if (cost) {
      text(document.querySelector(".cost-total"), compactEuro(cost.total_cost));
      const meta = document.querySelectorAll(".cost-meta > span");
      if (meta[0]) text(meta[0].querySelector("strong"), `${Number(cost.total_hours).toLocaleString("es-ES")} h`);
      if (meta[1]) {
        const hourly = Number(cost.total_cost) / Math.max(Number(cost.total_hours), 1);
        text(meta[1].querySelector("strong"), hourly.toLocaleString("es-ES", {
          style: "currency",
          currency: "EUR",
          maximumFractionDigits: 2,
        }));
      }
      if (meta[2]) text(meta[2].querySelector("strong"), `${Number(cost.coordination_percent).toLocaleString("es-ES")} %`);
    }

    const employeeMap = new Map(employees.map((item) => [item.employee_id, item]));
    const totals = new Map();
    entries.forEach((entry) => {
      const employee = employeeMap.get(entry.employee_id);
      if (!employee) return;
      const current = totals.get(entry.employee_id) || { employee, hours: 0, cost: 0 };
      current.hours += Number(entry.hours);
      current.cost += Number(entry.hours) * Number(employee.hourly_cost);
      totals.set(entry.employee_id, current);
    });

    const ranking = [...totals.values()].sort((a, b) => b.hours - a.hours).slice(0, 3);
    document.querySelectorAll(".employee-row").forEach((row, index) => {
      const person = ranking[index];
      if (!person) return;
      text(row.querySelector(".avatar"), initials(person.employee.name));
      text(row.querySelector(".employee-copy strong"), person.employee.name);
      text(row.querySelector(".employee-copy span"), person.employee.role);
      text(row.querySelector(".employee-hours strong"), `${person.hours.toLocaleString("es-ES")} h`);
      text(row.querySelector(".employee-cost"), euro.format(person.cost));
    });
  }

  function renderActions(actions) {
    document.querySelectorAll(".action-item").forEach((row, index) => {
      const item = actions[index];
      if (!item) return;
      text(row.querySelector(".action-copy strong"), item.title);
      text(row.querySelector(".action-copy small"), item.detail);
    });
  }

  function renderObjections(objections) {
    document.querySelectorAll(".objection").forEach((row, index) => {
      const item = objections[index];
      if (!item) return;
      text(row.querySelector("strong"), item.executive_role);
      text(row.querySelector("p"), item.question);
    });
  }

  async function sync() {
    const status = document.querySelector(".topbar-center > span:nth-child(2)");
    const pill = document.querySelector(".demo-pill");
    try {
      text(status, "Sincronizando datos demo…");
      const response = await fetch("/api/demo", { cache: "no-store" });
      if (!response.ok) throw new Error(`Demo API ${response.status}`);
      const data = await response.json();
      renderKpis(data.metrics || []);
      renderHealth(data.snapshots || []);
      renderRisks(data.risks || []);
      renderCosts(data.costs || [], data.employees || [], data.entries || []);
      renderActions(data.actions || []);
      renderObjections(data.objections || []);
      text(status, "Supabase demo sincronizado");
      text(pill, "DATOS EN VIVO");
      document.documentElement.dataset.demoSource = "supabase";
    } catch (error) {
      console.error("CEO Command Center sync failed", error);
      text(status, "Datos de respaldo activos");
      text(pill, "MODO LOCAL");
      document.documentElement.dataset.demoSource = "fallback";
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", sync, { once: true });
  } else {
    sync();
  }
  window.setInterval(sync, 60000);
})();
