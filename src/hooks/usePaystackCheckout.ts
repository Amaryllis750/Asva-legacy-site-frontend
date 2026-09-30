"use client";

import Paystack from "@paystack/inline-js";
import { PaymentObject } from "@/types/payment.types";
import { useRef, useState } from "react";
import { initializePayment } from "@/lib/payments/initializePayment";

type NewTransactionOptions = Parameters<Paystack["newTransaction"]>[0];
type OnSuccessCallback = NonNullable<NewTransactionOptions["onSuccess"]>;
type OnErrorCallback = NonNullable<NewTransactionOptions["onError"]>;
type OnLoadCallback = NonNullable<NewTransactionOptions["onLoad"]>;
type OnCancelCallback = NonNullable<NewTransactionOptions["onCancel"]>;

export default function usePaystackCheckout(callbacks?: {
  onSuccess?: OnSuccessCallback;
  onError?: OnErrorCallback;
  onLoad?: OnLoadCallback;
  onCancel?: OnCancelCallback;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const processingPayment = useRef(false);

  function cleanup() {
    processingPayment.current = false;
    setIsLoading(false);
  }

  async function start(paymentDetail: PaymentObject) {
    if (processingPayment.current) {
      return;
    }

    try {
      processingPayment.current = true;

      setIsLoading(true);
      setError(null);

      const { accessCode, transactionReference } =
        await initializePayment(paymentDetail);
      console.log(accessCode, transactionReference);

      const popup = new Paystack();
      popup.resumeTransaction(accessCode, {
        onSuccess: (transaction) => {
          cleanup();
          callbacks?.onSuccess && callbacks?.onSuccess(transaction);
        },
        onCancel: () => {
          cleanup();
          console.log("Payment Cancelled...");
          callbacks?.onCancel && callbacks.onCancel();
        },
        onError: (txError) => {
          cleanup();
          setError(txError.message);
          callbacks?.onError && callbacks.onError(txError);
        },
      });
    } catch (e) {
      console.log(e);
      processingPayment.current = false;
      setIsLoading(false);
      setError(`${(e instanceof Error) ? e.message : "Error when processing payment. Try again"}`);
      callbacks?.onError &&
        callbacks.onError({
          type: "setup",
          message: `${e instanceof Error ? e.message : "Error when initializing payment"}`,
        });
    }
  }

  return { start, isLoading, error };
}
