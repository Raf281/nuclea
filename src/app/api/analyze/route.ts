import { NextRequest } from "next/server";
import { analyzeText } from "@/lib/analysis/pipeline";
import type { AnalyzeRequest } from "@/lib/types";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body: AnalyzeRequest = await req.json();

    if (!body.text || body.text.trim().length < 20) {
      return Response.json(
        { error: "Input too short. Provide at least 20 characters." },
        { status: 400 }
      );
    }

    if (!body.student_id || !body.work_title) {
      return Response.json(
        { error: "Student and work title are required." },
        { status: 400 }
      );
    }

    // Create a streaming response using SSE
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        function sendEvent(data: object) {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
          );
        }

        try {
          const result = await analyzeText(body.text, {
            analysisMode: body.analysis_mode,
            mentalMonitoringEnabled: body.mental_monitoring_enabled,
            onProgress: (percent, message) => {
              sendEvent({ type: "progress", percent, message });
            },
          });

          sendEvent({ type: "complete", result });
        } catch (err) {
          sendEvent({
            type: "error",
            message: err instanceof Error ? err.message : "Analysis failed",
          });
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}
