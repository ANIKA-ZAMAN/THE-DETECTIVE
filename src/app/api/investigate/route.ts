import { NextResponse } from "next/server";
import { analyzeWebsite } from "@/lib/analyzer";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { success: false, error: "Target URL is required." },
        { status: 400 }
      );
    }

    const result = await analyzeWebsite(url);
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to analyze target website." },
      { status: 500 }
    );
  }
}
