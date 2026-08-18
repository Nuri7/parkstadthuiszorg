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
};

export async function submitIntakeForm(data: IntakeFormData) {
  try {
    const newRequest = await db.contactRequest.create({
      data: {
        userId: null,
        name: data.name,
        phone: data.phone,
        email: data.email || null,
        zipCode: data.postcode,
        careType: data.careType,
        forWhom: data.forWhom,
        situation: data.situation || null,
        preferredDays: data.preferredDays.join(", "),
        preferredTime: data.preferredTime,
        status: "new",
      },
    });

    // Notificatiemail naar info@ — mag de aanmelding nooit laten mislukken.
    try {
      await sendIntakeNotification(data);
    } catch (mailError) {
      console.error("Aanmelding opgeslagen, maar notificatiemail mislukt:", mailError);
    }

    return { success: true, request: newRequest };
  } catch (error) {
    console.error("Failed to submit intake form:", error);
    return { success: false, error: "Database error" };
  }
}
