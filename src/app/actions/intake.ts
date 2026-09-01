"use server";

import { db } from "@/lib/db";
import { sendIntakeNotification } from "@/lib/email";

export type IntakeFormData = {
  name: string;
  phone: string;
  email?: string;
  postcode: string;
  careType: string;
  forWhom: string;
  situation?: string;
  preferredDays: string[];
  preferredTime: string;
  /** Honeypot: onzichtbaar veld, hoort leeg te blijven. Bots vullen alles in. */
  company?: string;
};

// Dit is een publieke server action — de client-validatie bewijst niets.
const kort = (s: unknown, max: number) =>
  typeof s === "string" ? s.trim().slice(0, max) : "";

export async function submitIntakeForm(data: IntakeFormData) {
  // Honeypot gevuld → doen alsof het lukte, niets opslaan, geen mail.
  if (data.company) {
    return { success: true as const, request: null };
  }

  const name = kort(data.name, 200);
  const phone = kort(data.phone, 40);
  const postcode = kort(data.postcode, 10);
  if (!name || !phone) {
    return { success: false as const, error: "Naam en telefoonnummer zijn verplicht." };
  }

  try {
    const newRequest = await db.contactRequest.create({
      data: {
        userId: null,
        name,
        phone,
        email: kort(data.email, 200) || null,
        zipCode: postcode || null,
        careType: kort(data.careType, 50) || null,
        forWhom: kort(data.forWhom, 50) || null,
        situation: kort(data.situation, 3000) || null,
        preferredDays: (Array.isArray(data.preferredDays) ? data.preferredDays : [])
          .map((d) => kort(d, 20))
          .filter(Boolean)
          .slice(0, 7)
          .join(", "),
        preferredTime: kort(data.preferredTime, 30),
        status: "new",
      },
    });

    // Notificatiemail naar info@ — mag de aanmelding nooit laten mislukken.
    // Bewust de opgeschoonde waarden, niet de ruwe invoer.
    try {
      await sendIntakeNotification({
        name,
        phone,
        postcode,
        email: kort(data.email, 200) || undefined,
        careType: kort(data.careType, 50),
        forWhom: kort(data.forWhom, 50),
        situation: kort(data.situation, 3000) || undefined,
        preferredDays: newRequest.preferredDays ? newRequest.preferredDays.split(", ") : [],
        preferredTime: newRequest.preferredTime ?? "",
      });
    } catch (mailError) {
      console.error("Aanmelding opgeslagen, maar notificatiemail mislukt:", mailError);
    }

    return { success: true, request: newRequest };
  } catch (error) {
    console.error("Failed to submit intake form:", error);
    return { success: false, error: "Database error" };
  }
}
