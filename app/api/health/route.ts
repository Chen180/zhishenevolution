import { createHealthStatus } from "@/lib/domain/health";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  return Response.json(
    {
      success: true,
      data: {
        ...createHealthStatus(new Date()),
        uptimeSeconds: Math.floor(process.uptime()),
      },
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
