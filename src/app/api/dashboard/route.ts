import { NextResponse } from "next/server";
import { getDashboardStats } from "@/lib/data";

// GET /api/dashboard — dashboard stats for the user's school
export async function GET() {
  const stats = await getDashboardStats("school-1");
  return NextResponse.json(stats);
}
