"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  Check,
  Loader2,
  Mail,
  Send,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import type { ChatRegel } from "@/lib/assistent/weergave";

interface OpenBevestiging {
  id: string;
  naam: string;
  invoer: Record<string, unknown>;
  omschrijving: string;
}

interface Props {
  gesprekId: string | null;
  beginRegels: ChatRegel[];
  beginOpen: OpenBevestiging[];
  mailBeschikbaar: boolean;
}

const VOORBEELDEN = [
  "Wie moet ik deze week bellen?",
  "Zet mevrouw De Wit morgen om 9:00 in de agenda, 45 minuten wondzorg.",
  "Wat staat er nieuw in de mailbox?",
  "Maak een nieuwe cliënt aan: Jan Peters, 06-12345678, Kerkrade.",
];

export function Assistent({
  gesprekId: beginId,
  beginRegels,
  beginOpen,
  mailBeschikbaar,
}: Props) {
  const router = useRouter();
  const [gesprekId, setGesprekId] = useState<string | null>(beginId);
  const [regels, setRegels] = useState<ChatRegel[]>(beginRegels);
  const [invoer, setInvoer] = useState("");
  const [bezig, setBezig] = useState(false);
  const [open, setOpen] = useState<OpenBevestiging[]>(beginOpen);
  const [fout, setFout] = useState<string | null>(null);
  const [denkt, setDenkt] = useState<string>("");

  const onderkant = useRef<HTMLDivElement>(null);
  const veld = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    onderkant.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [regels, bezig, open, denkt]);

  async function praat(payload: {
    bericht?: string;
    besluiten?: { id: string; akkoord: boolean }[];
  }) {
    setBezig(true);
    setFout(null);
    setDenkt("");

    // Alvast een lege assistent-regel waar de stream in loopt.
    setRegels((r) => [...r, { rol: "assistant", tekst: "", acties: [] }]);

    const patch = (fn: (r: ChatRegel) => ChatRegel) =>
      setRegels((rs) => {
        const kopie = [...rs];
        kopie[kopie.length - 1] = fn(kopie[kopie.length - 1]);
        return kopie;
      });

    try {
      const res = await fetch("/api/assistent/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gesprekId, ...payload }),
      });

      if (!res.ok || !res.body) {
        throw new Error((await res.text()) || "De assistent reageerde niet.");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const delen = buffer.split("\n\n");
        buffer = delen.pop() ?? "";

        for (const deel of delen) {
          const regel = deel.split("\n").find((l) => l.startsWith("data: "));
          if (!regel) continue;
          const ev = JSON.parse(regel.slice(6));

          switch (ev.type) {
            case "gesprek":
              setGesprekId(ev.id);
              break;
            case "denken":
              setDenkt("ja"); // alleen "hij is aan het nadenken"; de ruwe
              break;          // redeneertekst is Engels en zegt Meyrem niets
            case "tekst":
              setDenkt("");
              patch((r) => ({ ...r, tekst: r.tekst + ev.tekst }));
              break;
            case "toolStart":
              patch((r) => ({
                ...r,
                acties: [...r.acties, { naam: ev.naam, samenvatting: ev.omschrijving }],
              }));
              break;
            case "tool":
              patch((r) => {
                const acties = [...r.acties];
                if (acties.length) {
                  acties[acties.length - 1] = {
                    naam: ev.naam,
                    samenvatting: ev.samenvatting,
                    fout: ev.fout,
                  };
                }
                return { ...r, acties };
              });
              break;
            case "bevestiging":
              setOpen(ev.open);
              break;
            case "fout":
              setFout(ev.bericht);
              break;
          }
        }
      }
    } catch (e) {
      setFout(e instanceof Error ? e.message : "Er ging iets mis.");
    } finally {
      setBezig(false);
      setDenkt("");
      // Lege placeholder opruimen als er niets is binnengekomen.
      setRegels((rs) => {
        const laatste = rs[rs.length - 1];
        if (laatste && laatste.rol === "assistant" && !laatste.tekst && !laatste.acties.length) {
          return rs.slice(0, -1);
        }
        return rs;
      });
      router.refresh(); // zijbalk met gesprekken bijwerken
    }
  }

  function verstuur(tekst?: string) {
    const bericht = (tekst ?? invoer).trim();
    if (!bericht || bezig) return;
    setInvoer("");
    setOpen([]);
    setRegels((r) => [...r, { rol: "user", tekst: bericht, acties: [] }]);
    void praat({ bericht });
  }

  function beslis(id: string, akkoord: boolean) {
    if (bezig) return;
    const rest = open.filter((o) => o.id !== id);
    setOpen(rest);
    // Pas doorsturen als alles beantwoord is; de server hervat dan de lus.
    if (rest.length === 0) {
      void praat({ besluiten: [...antwoorden.current, { id, akkoord }] });
      antwoorden.current = [];
    } else {
      antwoorden.current.push({ id, akkoord });
    }
  }
  const antwoorden = useRef<{ id: string; akkoord: boolean }[]>([]);

  return (
    <div className="flex flex-col h-[calc(100dvh-9.5rem)] lg:h-screen">
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
        <div className="mx-auto max-w-3xl space-y-5">
          {regels.length === 0 && open.length === 0 && (
            <Welkom mailBeschikbaar={mailBeschikbaar} onKies={(v) => verstuur(v)} />
          )}

          {regels.map((r, i) => (
            <Bubbel key={i} regel={r} />
          ))}

          {bezig && denkt && (
            <div className="text-sm text-[#8a9a8a] dark:text-[#6f9a8a] flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin shrink-0" />
              <span>Even nadenken…</span>
            </div>
          )}

          {open.map((o) => (
            <Bevestiging key={o.id} item={o} bezig={bezig} onBeslis={beslis} />
          ))}

          {fout && (
            <div className="rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-[#3a1414] px-4 py-3 text-sm text-red-700 dark:text-red-200 flex gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{fout}</span>
            </div>
          )}

          <div ref={onderkant} />
        </div>
      </div>

      <div className="border-t border-[#ede7db] dark:border-[#086370] bg-white dark:bg-[#02191c] px-4 sm:px-6 py-3">
        <div className="mx-auto max-w-3xl flex items-end gap-2">
          <textarea
            ref={veld}
            rows={1}
            value={invoer}
            disabled={bezig}
            placeholder={
              open.length
                ? "Beantwoord eerst de vraag hierboven…"
                : "Wat moet ik voor je doen?"
            }
            onChange={(e) => {
              setInvoer(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = Math.min(e.target.scrollHeight, 200) + "px";
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                verstuur();
              }
            }}
            className="flex-1 resize-none rounded-xl border border-[#dce8de] dark:border-[#086370] bg-white dark:bg-[#02191c] px-4 py-3 text-sm text-[#064a54] dark:text-white placeholder:text-[#a9b8ac] focus:outline-none focus:ring-2 focus:ring-[#4A9C6E] disabled:opacity-60"
          />
          <button
            onClick={() => verstuur()}
            disabled={bezig || !invoer.trim()}
            aria-label="Versturen"
            className="rounded-xl bg-[#4A9C6E] text-white p-3 hover:bg-[#3d8a5f] disabled:opacity-40 disabled:hover:bg-[#4A9C6E] transition-colors"
          >
            {bezig ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
        <p className="mx-auto max-w-3xl text-[11px] text-[#a9b8ac] mt-2">
          De assistent werkt rechtstreeks in het dossier. Verwijderen en mail
          versturen vraagt hij eerst aan je.
        </p>
      </div>
    </div>
  );
}

function Welkom({
  mailBeschikbaar,
  onKies,
}: {
  mailBeschikbaar: boolean;
  onKies: (v: string) => void;
}) {
  return (
    <div className="pt-8 sm:pt-16">
      <div className="flex items-center gap-2 text-[#064a54] dark:text-[#5cb0bd]">
        <Sparkles className="w-5 h-5" />
        <h1 className="font-heading text-2xl">Assistent</h1>
      </div>
      <p className="text-[#4f6b6f] dark:text-[#9fc7b5] mt-2 text-sm leading-relaxed">
        Vertel gewoon wat je wilt. Ik zoek het op, vul het in en houd het
        dossier bij. Mail lezen en beantwoorden kan ook.
      </p>
      {!mailBeschikbaar && (
        <p className="mt-3 text-xs text-[#8a5a12] dark:text-[#e2b96b] bg-[#fdf3e3] dark:bg-[#3a2c12] rounded-lg px-3 py-2">
          Mail lezen staat nog niet aan (IMAP-gegevens ontbreken). Versturen en
          alles rond het dossier werkt wel.
        </p>
      )}
      <div className="mt-6 grid gap-2 sm:grid-cols-2">
        {VOORBEELDEN.map((v) => (
          <button
            key={v}
            onClick={() => onKies(v)}
            className="text-left text-sm rounded-xl border border-[#dce8de] dark:border-[#086370] px-4 py-3 text-[#4f6b6f] dark:text-[#9fc7b5] hover:bg-[#f0f6f1] dark:hover:bg-[#0b2b30] transition-colors"
          >
            {v}
          </button>
        ))}
      </div>
    </div>
  );
}

/** Inline: **vet** wordt vet, de rest blijft tekst. */
function Inline({ waarde }: { waarde: string }) {
  const delen = waarde.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {delen.map((d, i) =>
        d.startsWith("**") && d.endsWith("**") ? (
          <strong key={i}>{d.slice(2, -2)}</strong>
        ) : (
          <span key={i}>{d}</span>
        ),
      )}
    </>
  );
}

const cellen = (regel: string) =>
  regel.replace(/^\||\|$/g, "").split("|").map((c) => c.trim());

const isScheiding = (regel: string) => /^\|?[\s:|-]+\|[\s:|-]*$/.test(regel.trim());

/**
 * Kleine markdown-weergave: opsommingen en tabellen, want daar valt een
 * dossieroverzicht vanzelf in uiteen. Bewust geen library — de tekst komt van
 * het model, dus hoe minder er geïnterpreteerd wordt, hoe beter.
 */
function Tekst({ waarde }: { waarde: string }) {
  const regels = waarde.split("\n");
  const blokken: React.ReactNode[] = [];
  let i = 0;

  while (i < regels.length) {
    const regel = regels[i];

    // Tabel: een kop, een scheidingsregel, dan rijen.
    if (
      regel.trim().startsWith("|") &&
      regels[i + 1] !== undefined &&
      isScheiding(regels[i + 1])
    ) {
      const kop = cellen(regel);
      const rijen: string[][] = [];
      i += 2;
      while (i < regels.length && regels[i].trim().startsWith("|")) {
        rijen.push(cellen(regels[i]));
        i++;
      }
      blokken.push(
        <div key={blokken.length} className="overflow-x-auto my-2">
          <table className="text-[13px] border-collapse">
            <thead>
              <tr>
                {kop.map((c, k) => (
                  <th
                    key={k}
                    className="text-left font-semibold text-[#064a54] dark:text-[#5cb0bd] border-b border-[#dce8de] dark:border-[#086370] px-2.5 py-1.5 whitespace-nowrap"
                  >
                    <Inline waarde={c} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rijen.map((r, ri) => (
                <tr key={ri} className="border-b border-[#f0ece3] dark:border-[#0b3b42]">
                  {r.map((c, ci) => (
                    <td key={ci} className="px-2.5 py-1.5 align-top">
                      <Inline waarde={c} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      );
      continue;
    }

    // Opsomming
    if (/^\s*[-*]\s+/.test(regel)) {
      const items: string[] = [];
      while (i < regels.length && /^\s*[-*]\s+/.test(regels[i])) {
        items.push(regels[i].replace(/^\s*[-*]\s+/, ""));
        i++;
      }
      blokken.push(
        <ul key={blokken.length} className="list-disc pl-5 space-y-1 my-1.5">
          {items.map((t, k) => (
            <li key={k}>
              <Inline waarde={t} />
            </li>
          ))}
        </ul>,
      );
      continue;
    }

    // Gewone alinea: opeenvolgende regels bij elkaar houden.
    const alinea: string[] = [];
    while (
      i < regels.length &&
      regels[i].trim() !== "" &&
      !/^\s*[-*]\s+/.test(regels[i]) &&
      !regels[i].trim().startsWith("|")
    ) {
      alinea.push(regels[i]);
      i++;
    }
    if (alinea.length) {
      blokken.push(
        <p key={blokken.length} className="whitespace-pre-wrap leading-relaxed">
          <Inline waarde={alinea.join("\n")} />
        </p>,
      );
    } else {
      i++;
    }
  }

  return <div className="space-y-1.5">{blokken}</div>;
}

function Bubbel({ regel }: { regel: ChatRegel }) {
  if (regel.rol === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-[#064a54] text-white px-4 py-2.5 text-sm">
          <Tekst waarde={regel.tekst} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {regel.acties.length > 0 && (
        <ul className="space-y-1">
          {regel.acties.map((a, i) => (
            <li
              key={i}
              className={
                "text-xs flex items-center gap-1.5 " +
                (a.fout
                  ? "text-red-600 dark:text-red-300"
                  : "text-[#8a9a8a] dark:text-[#6f9a8a]")
              }
            >
              {a.fout ? (
                <X className="w-3.5 h-3.5" />
              ) : (
                <Check className="w-3.5 h-3.5" />
              )}
              {a.samenvatting}
            </li>
          ))}
        </ul>
      )}
      {regel.tekst && (
        <div className="text-sm text-[#1f3a34] dark:text-[#e7f2ec]">
          <Tekst waarde={regel.tekst} />
        </div>
      )}
    </div>
  );
}

function Bevestiging({
  item,
  bezig,
  onBeslis,
}: {
  item: OpenBevestiging;
  bezig: boolean;
  onBeslis: (id: string, akkoord: boolean) => void;
}) {
  const isMail = item.naam === "mail_stuur";
  const inv = item.invoer as Record<string, string>;

  return (
    <div className="rounded-xl border-2 border-[#4A9C6E] dark:border-[#4A9C6E] bg-[#f4faf6] dark:bg-[#08282c] overflow-hidden">
      <div className="px-4 py-2.5 bg-[#4A9C6E] text-white text-sm font-medium flex items-center gap-2">
        {isMail ? <Mail className="w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
        {item.omschrijving}
      </div>

      <div className="px-4 py-3 text-sm text-[#1f3a34] dark:text-[#e7f2ec] space-y-2">
        {isMail ? (
          <>
            <Rij label="Aan" waarde={inv.aan} />
            {inv.cc && <Rij label="Cc" waarde={inv.cc} />}
            {/* Bcc hoort zichtbaar te zijn vóór je op versturen klikt. */}
            {inv.bcc && <Rij label="Bcc" waarde={inv.bcc} />}
            <Rij label="Onderwerp" waarde={inv.onderwerp} />
            <div className="rounded-lg bg-white dark:bg-[#02191c] border border-[#dce8de] dark:border-[#086370] px-3 py-2 whitespace-pre-wrap text-[13px] leading-relaxed max-h-72 overflow-y-auto">
              {inv.tekst}
            </div>
          </>
        ) : (
          <>
            <Rij label="Wat" waarde={`${inv.model} — ${inv.id}`} />
            {inv.reden && <Rij label="Reden" waarde={inv.reden} />}
            <p className="text-xs text-[#b02525] dark:text-[#f0a3a3]">
              Dit kan niet ongedaan gemaakt worden. Gekoppelde gegevens
              (bezoeken, financieringen, wonden) verdwijnen mee.
            </p>
          </>
        )}
      </div>

      <div className="px-4 py-3 border-t border-[#dce8de] dark:border-[#086370] flex gap-2">
        <button
          onClick={() => onBeslis(item.id, true)}
          disabled={bezig}
          className="rounded-lg bg-[#4A9C6E] text-white px-4 py-2 text-sm font-medium hover:bg-[#3d8a5f] disabled:opacity-50"
        >
          {isMail ? "Versturen" : "Definitief verwijderen"}
        </button>
        <button
          onClick={() => onBeslis(item.id, false)}
          disabled={bezig}
          className="rounded-lg border border-[#dce8de] dark:border-[#086370] px-4 py-2 text-sm text-[#4f6b6f] dark:text-[#9fc7b5] hover:bg-[#f0f6f1] dark:hover:bg-[#0b2b30] disabled:opacity-50"
        >
          Nee, niet doen
        </button>
      </div>
    </div>
  );
}

function Rij({ label, waarde }: { label: string; waarde?: string }) {
  if (!waarde) return null;
  return (
    <div className="flex gap-2 text-[13px]">
      <span className="text-[#8a9a8a] w-20 shrink-0">{label}</span>
      <span className="min-w-0 break-words">{waarde}</span>
    </div>
  );
}
