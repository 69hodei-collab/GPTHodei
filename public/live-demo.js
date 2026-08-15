(() => {
  const SUPABASE_URL = "https://wcyeomrxcqicswrluulf.supabase.co";
  const SUPABASE_KEY = "sb_publishable_gUfk4fJvC55oifoNNVrCKw_oK_Fsuwx";
  const headers = { apikey: SUPABASE_KEY };
  const currency = new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  });

  async function read(resource) {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/${resource}`, {
      headers,
      cache: "no-store",
    });
    if (!response.ok) {
      throw new Error(`Supabase ${response.status}: ${await response.text()}`);
    }
    return response.json();
  }

  function setText(node, value) {
    if (node && value !== undefined && value !== null) node.textContent = String(value);
  }

  function compactEuro(value) {
    const amount = Number(value || 0);
    if (amount >= 1000) return `€${(amount / 1000).toLocaleString("es-ES", { maximumFractionDigits: 1 })}K`;
    return currency.format(amount);
  }

  function initials(name) {
    return String(name || "")
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  }

  function updateKpis(metrics) {
    const metricMap = new Map(metrics.map((metric) => [metric.metric_key, metric]));
    const ordered = ["sales_target", "runway", "forecast_margin", "open_decisions"];
    document.querySelectorAll(".kpi-card").forEach((card, index) => {
      const metric = metricMap.get(ordered[index]);
      if (!metric) return;
      setText(card.querySelector(".kpi-topline > span:first-child"), metric.label);
      setText(card.querySelector(":scope > strong"), metric.display_value);
      setText(card.querySelector(".trend"), metric.trend_display);
      const trend = card.querySelector(".trend");
      if (trend) trend.className = `trend ${metric.tone}`;
    });
  }

  function updateHealth(metrics, snapshots) {
    const health = metrics.find((metric) => metric.metric_key === "company_health");
    if (health) {
      setText(document.querySelector(".score-ring strong"), Math.round(Number(health.value)));
      setText(document.querySelector(".score-copy p"), `${health.trend_display} frente a la semana anterior`);
    }
    const fills = document.querySelectorAll(".bar-fill");
    snapshots.forEach((snapshot, index) => {
      if (fills[index]) fills[index].style.height = `${snapshot.health_score}%`;
    });
  }

  function updateRisks(risks) {
    const severityLabel = { high: "Alto", medium: "Medio", low: "Bajo" };
    const severityClass = { high: "alto", medium: "medio", low: "bajo" };
    document.querySelectorAll(".risk-item").forEach((item, index) => {
      const risk = risks[index];
      if (!risk) return;
      const severity = item.querySelector(".risk-severity");
      if (severity) {
        severity.className = `risk-severity ${severityClass[risk.severity] || "medio"}`;
        severity.textContent = severityLabel[risk.severity] || risk.severity;
      }
      setText(item.querySelector(".risk-copy strong"), risk.title);
      setText(item.querySelector(".risk-copy small"), risk.detail);
    });
  }

  function updateCosts(costRows, employees, entries) {
    const cost = costRows.find((row) => row.project_id === "phoenix") || costRows[0];
    if (cost) {
      setText(document.querySelector(".cost-total"), compactEuro(cost.total_cost));
      const meta = document.querySelectorAll(".cost-meta > span");
      if (meta[0]) setText(meta[0].querySelector("strong"), `${Number(cost.total_hours).toLocaleString("es-ES")} h`);
      if (meta[1]) {
        const hourly = Number(cost.total_cost) / Math.max(Number(cost.total_hours), 1);
        setText(meta[1].querySelector("strong"), `${hourly.toLocaleString("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 2 })}`);
      }
      if (meta[2]) setText(meta[2].querySelector("strong"), `${Number(cost.coordination_percent).toLocaleString("es-ES")} %`);
    }

    const employeeMap = new Map(employees.map((employee) => [employee.employee_id, employee]));
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
      setText(row.querySelector(".avatar"), initials(person.employee.name));
      setText(row.querySelector(".employee-copy strong"), person.employee.name);
      setText(row.querySelector(".employee-copy span"), person.employee.role);
      setText(row.querySelector(".employee-hours strong"), `${person.hours.toLocaleString("es-ES")} h`);
      setText(row.querySelector(".employee-cost"), currency.format(person.cost));
    });
  }

  function updateActions(actions) {
    document.querySelectorAll(".action-item").forEach((item, index) => {
      const action = actions[index];
      if (!action) return;
      setText(item.querySelector(".action-copy strong"), action.title);
      setText(item.querySelector(".action-copy small"), action.detail);
    });
  }

  function updateObjections(objections) {
    document.querySelectorAll(".objection").forEach((item, index) => {
      const objection = objections[index];
      if (!objection) return;
      setText(item.querySelector("strong"), objection.executive_role);
      setText(item.querySelector("p"), objection.question);
    });
  }

  async function syncDashboard() {
    const statusText = document.querySelector(".topbar-center > span:nth-child(2)");
    const demoPill = document.querySelector(".demo-pill");
    try {
      setText(statusText, "Sincronizando datos demo…");
      const [metrics, snapshots, risks, costs, employees, entries, actions, objections] = await Promise.all([
        read("demo_metrics?select=*&order=updated_at.desc"),
        read("demo_health_snapshots?select=*&order=snapshot_date.asc"),
        read("demo_risks?select=*&status=neq.resolved&order=detected_at.asc"),
        read("demo_project_costs?select=*&project_id=eq.phoenix"),
        read("demo_employees?select=employee_id,name,role,hourly_cost&active=eq.true"),
        read("demo_time_entries?select=employee_id,hours,activity_type&project_id=eq.phoenix"),
        read("demo_actions?select=*&order=priority.asc,due_at.asc"),
        read("demo_objections?select=*&scenario_key=eq.price-increase&order=sort_order.asc"),
      ]);

      updateKpis(metrics);
      updateHealth(metrics, snapshots);
      updateRisks(risks);
      updateCosts(costs, employees, entries);
      updateActions(actions);
      updateObjections(objections);
      setText(statusText, "Supabase demo sincronizado");
      setText(demoPill, "DATOS EN VIVO");
      document.documentElement.dataset.demoSource = "supabase";
    } catch (error) {
      console.error("CEO Command Center demo sync failed", error);
      setText(statusText, "Datos de respaldo activos");
      setText(demoPill, "MODO LOCAL");
      document.documentElement.dataset.demoSource = "fallback";
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", syncDashboard, { once: true });
  } else {
    syncDashboard();
  }
  window.setInterval(syncDashboard, 60000);
})();
