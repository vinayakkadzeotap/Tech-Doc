import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  if (!type) {
    return NextResponse.json(
      { error: "Missing required query parameter: type" },
      { status: 400 }
    );
  }

  try {
    const supabase = await createClient();

    switch (type) {
      case "audience": {
        const [fieldsResult, presetsResult] = await Promise.all([
          supabase.from("sim_schema_fields").select("*"),
          supabase.from("sim_campaign_presets").select("*"),
        ]);

        return NextResponse.json({
          fields: fieldsResult.data || [],
          presets: presetsResult.data || [],
        });
      }

      case "churn": {
        const vertical = searchParams.get("vertical");

        if (vertical) {
          const [verticalResult, customersResult] = await Promise.all([
            supabase
              .from("sim_verticals")
              .select("*")
              .eq("name", vertical)
              .maybeSingle(),
            supabase
              .from("sim_customers")
              .select("*")
              .eq("vertical", vertical),
          ]);

          return NextResponse.json({
            verticalInfo: verticalResult.data || null,
            customers: customersResult.data || [],
          });
        }

        const { data } = await supabase
          .from("sim_verticals")
          .select("*");

        return NextResponse.json({ verticals: data || [] });
      }

      case "health": {
        const scenario = searchParams.get("scenario");

        if (scenario) {
          const { data } = await supabase
            .from("sim_health_scenarios")
            .select("*")
            .eq("name", scenario)
            .maybeSingle();

          return NextResponse.json({ scenario: data || null });
        }

        const { data } = await supabase
          .from("sim_health_scenarios")
          .select("*");

        return NextResponse.json({ scenarios: data || [] });
      }

      default:
        return NextResponse.json(
          { error: `Unknown simulator type: ${type}` },
          { status: 400 }
        );
    }
  } catch {
    // Return empty data so client-side fallbacks kick in
    return NextResponse.json({ fields: [], presets: [], verticals: [], scenarios: [] });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    const { data, error } = await supabase
      .from("sim_user_results")
      .insert(body)
      .select();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ result: data }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
