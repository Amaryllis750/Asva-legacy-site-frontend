import { API_URL } from "../config";
import { PaymentObject } from "@/types/payment.types";

export async function initializePayment(paymentData: PaymentObject) {
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

    const response = await fetch(`${API_URL}/api/payments/initialize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: paymentData.email,
        amount: `${paymentData.amount}`,
        description: paymentData.description,
        idempotency_key: idempotencyKey,
        purpose: paymentData.purpose
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.log(data);
      throw Error(
        data.detail ||
          data.message ||
          data.error ||
          "Error when initializing payment. Try again",
      );
    }
    const access_code: string = data.access_code;
    const reference: string = data.reference;

    return { accessCode: access_code, transactionReference: reference };
  } catch (e: any) {
    throw Error(`${e.message}`);
  }
}
