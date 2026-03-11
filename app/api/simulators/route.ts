import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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
    switch (type) {
      case "audience": {
        const [fieldsResult, presetsResult] = await Promise.all([
          supabase.from("sim_schema_fields").select("*"),
          supabase.from("sim_campaign_presets").select("*"),
        ]);

        if (fieldsResult.error) {
          return NextResponse.json(
            { error: fieldsResult.error.message },
            { status: 500 }
          );
        }
        if (presetsResult.error) {
          return NextResponse.json(
            { error: presetsResult.error.message },
            { status: 500 }
          );
        }

        return NextResponse.json({
          fields: fieldsResult.data,
          presets: presetsResult.data,
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
              .single(),
            supabase
              .from("sim_customers")
              .select("*")
              .eq("vertical", vertical),
          ]);

          if (verticalResult.error) {
            return NextResponse.json(
              { error: verticalResult.error.message },
              { status: 500 }
            );
          }
          if (customersResult.error) {
            return NextResponse.json(
              { error: customersResult.error.message },
              { status: 500 }
            );
          }

          return NextResponse.json({
            vertical: verticalResult.data,
            customers: customersResult.data,
          });
        }

        const { data, error } = await supabase
          .from("sim_verticals")
          .select("*");

        if (error) {
          return NextResponse.json(
            { error: error.message },
            { status: 500 }
          );
        }

        return NextResponse.json({ verticals: data });
      }

      case "health": {
        const scenario = searchParams.get("scenario");

        if (scenario) {
          const { data, error } = await supabase
            .from("sim_health_scenarios")
            .select("*")
            .eq("name", scenario)
            .single();

          if (error) {
            return NextResponse.json(
              { error: error.message },
              { status: 500 }
            );
          }

          return NextResponse.json({ scenario: data });
        }

        const { data, error } = await supabase
          .from("sim_health_scenarios")
          .select("*");

        if (error) {
          return NextResponse.json(
            { error: error.message },
            { status: 500 }
          );
        }

        return NextResponse.json({ scenarios: data });
      }

      default:
        return NextResponse.json(
          { error: `Unknown simulator type: ${type}` },
          { status: 400 }
        );
    }
  } catch (err) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
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
  } catch (err) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
