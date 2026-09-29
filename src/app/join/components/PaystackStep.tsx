"use client";
import Paystack from "@paystack/inline-js";
import { API_URL } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { FormData } from "./types";

export default function PaystackStep({
  form,
  onNext,
}: {
  form: FormData;
  onNext: () => void;
}) {
  async function initializePayment() {
    const encodedData = new TextEncoder().encode(`${form.email}_ACCOUNT_CREATION`,);
    const hashBuffer = await window.crypto.subtle.digest("SHA-256",encodedData);

    // Convert to hex string
    const idempotencyKey = Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    
    const response = await fetch(`${API_URL}/api/payments/initialize-payment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.email,
        amount: "2000",
        payment_channel: "bank_transfer",
        description: "account creation fee",
        idempotency_key: idempotencyKey,
      }),
    });

    const data = await response.json();
    const access_code: string = data.access_code;

    const popup = new Paystack();
    popup.resumeTransaction(access_code);
  }

  return (
    <>
      <div className="flex flex-col gap-6">
        <div>
          <h1> Initiate Payment </h1>
          <span> Make a payment of N2000 to complete your payment </span>
        </div>

        <Button onClick={initializePayment}>Proceed to Payment</Button>
      </div>
    </>
  );
}
