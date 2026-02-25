import { NextRequest } from "next/server";
import { analyzeText } from "@/lib/analysis/pipeline";
import { createWork, createAnalysis, isLiveMode } from "@/lib/data";
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
          const startTime = Date.now();

          const result = await analyzeText(body.text, {
            analysisMode: body.analysis_mode,
            mentalMonitoringEnabled: body.mental_monitoring_enabled,
            onProgress: (percent, message) => {
              sendEvent({ type: "progress", percent, message });
            },
          });

          const processingTime = Date.now() - startTime;

          // Persist to database in live mode
          if (isLiveMode()) {
            try {
              // Get user from cookie
              const userCookie = req.cookies.get("nuclea-user")?.value;
              const user = userCookie ? JSON.parse(userCookie) : null;
              const submittedBy = user?.id ?? "unknown";

              // Create work entry
              const work = await createWork({
                student_id: body.student_id,
                title: body.work_title,
                work_type: body.work_type,
                original_text: body.text,
                word_count: body.text.split(/\s+/).length,
                submitted_by: submittedBy,
              });

              // Create analysis entry
              if (work) {
                await createAnalysis({
                  work_id: work.id,
                  mode: body.analysis_mode,
                  result,
                  mental_monitoring_enabled: body.mental_monitoring_enabled,
                  llm_model: "claude-sonnet-4-20250514",
                  processing_time_ms: processingTime,
                });
              }
            } catch {
              // DB persistence failure is non-critical — result still returned
              console.error("Failed to persist analysis to database");
            }
          }

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
