import { API_URL } from "../config";
import { PaymentObject } from "@/types/payment.types";

export async function verifyPayment(paymentData: Omit<PaymentObject, "description">) {
  try {
    const encodedData = new TextEncoder().encode(
      `${paymentData.email}_${paymentData.purpose}`,
    );
    const hashBuffer = await window.crypto.subtle.digest(
      "SHA-256",
      encodedData,
    );

    // Convert to hex string
    const idempotencyKey = Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    await fetch(`${API_URL}/api/payments/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: paymentData.email,
        amount: `${paymentData.amount}`,
        idempotency_key: idempotencyKey,
        purpose: paymentData.purpose,
      }),
    });

    return;
  } catch (e: any) {
    throw Error(`${e.message}`);
  }
}
