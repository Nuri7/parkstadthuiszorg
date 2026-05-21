"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

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
    const { userId } = await auth().catch(() => ({ userId: null })); // Don't crash if auth is not ready/available

    const newRequest = await db.contactRequest.create({
      data: {
        userId: userId || null,
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

    return { success: true, request: newRequest };
  } catch (error) {
    console.error("Failed to submit intake form:", error);
    return { success: false, error: "Database error" };
  }
}
