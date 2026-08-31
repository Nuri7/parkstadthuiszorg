// SSE-transport voor de webchat. De lus zelf staat in lib/assistent/lus.ts,
// zodat WhatsApp dezelfde assistent kan gebruiken.

import type { NextRequest } from "next/server";
import { isAdminAuthed } from "@/lib/adminGuard";
import { draaiLus, type Verzoek } from "@/lib/assistent/lus";
import { nieuwGesprek } from "@/lib/assistent/gesprek";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST(req: NextRequest) {

  if (!(await isAdminAuthed())) {
    return new Response("Niet ingelogd", { status: 401 });
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(
      "ANTHROPIC_API_KEY ontbreekt — de assistent kan nog niet werken.",
      { status: 503 },
    );
  }

  const body = (await req.json()) as Verzoek;
  const gesprekId = body.gesprekId || (await nieuwGesprek());

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const stuur = (data: Record<string, unknown>) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      try {
        stuur({ type: "gesprek", id: gesprekId });
        await draaiLus(gesprekId, body, stuur);
      } catch (e) {
        console.error("[assistent]", e);
        stuur({
          type: "fout",
          bericht: e instanceof Error ? e.message : "Er ging iets mis.",
        });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}

