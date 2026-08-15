const SUPABASE_URL = "https://wcyeomrxcqicswrluulf.supabase.co";
const SUPABASE_KEY = "sb_publishable_gUfk4fJvC55oifoNNVrCKw_oK_Fsuwx";

async function read(resource) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${resource}`, {
    headers: { apikey: SUPABASE_KEY },
    cache: "no-store",
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Supabase ${response.status}: ${detail}`);
  }

  return response.json();
}

export async function GET() {
  try {
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

    return Response.json(
      {
        source: "supabase",
        generatedAt: new Date().toISOString(),
        metrics,
        snapshots,
        risks,
        costs,
        employees,
        entries,
        actions,
        objections,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      },
    );
  } catch (error) {
    console.error("CEO Command Center demo API failed", error);
    return Response.json(
      {
        source: "fallback",
        error: "No se pudieron recuperar los datos demo.",
      },
      { status: 502 },
    );
  }
}
