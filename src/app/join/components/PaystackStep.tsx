"use client";
import { Button } from "@/components/ui/button";
import { FormData } from "./types";
import { Loader2, ShieldCheck } from "lucide-react";
import usePaystackCheckout from "@/hooks/usePaystackCheckout";
import { verifyPayment } from "@/lib/payments/verifyPayment";

export default function PaystackStep({
  form,
  onNext,
}: {
  form: FormData;
  onNext: () => void;
}) {

  const { start, isLoading, error } = usePaystackCheckout({
    onSuccess: () => {
      verifyPayment({
        email: form.email,
        amount: 2000,
        purpose: "ACCOUNT_CREATION",
      });
      onNext();
    },
  });

  const AMOUNT = 2000;
  const formattedAmount = `₦${AMOUNT.toLocaleString()}`;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Complete Payment</h1>
        <p className="text-sm text-gray-500 mt-1">
          Pay{" "}
          <span className="font-semibold text-gray-700">{formattedAmount}</span>{" "}
          to complete your account creation.
        </p>
      </div>

      {/* Summary */}
      <div className="bg-green-50 rounded-2xl p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">
            Amount
          </span>
          <span className="text-2xl font-bold text-green-600">
            {formattedAmount}
          </span>
        </div>

        <div className="h-px bg-green-100" />

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 font-medium">Payment for</span>
          <span className="text-sm font-semibold text-gray-800">
            Account creation
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 font-medium">Email</span>
          <span className="text-sm font-semibold text-gray-800 truncate ml-4">
            {form.email}
          </span>
        </div>
      </div>

      {/* Info note */}
      <div className="flex gap-3 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
        <ShieldCheck size={16} className="text-green-500 shrink-0 mt-0.5" />
        <p className="text-xs text-gray-600 leading-relaxed">
          You'll be taken to Paystack's secure checkout to pay with your card,
          bank transfer or USSD. You'll be brought back here once it's done.
        </p>
      </div>

      {/* Error */}
      {error && <p className="text-xs text-red-500">{error}</p>}

      <Button
        onClick={() =>
          start({
            email: form.email,
            amount: AMOUNT,
            description: "creating an account",
            purpose: "ACCOUNT_CREATION",
          })
        }
        disabled={isLoading}
        className="bg-green-500 hover:bg-green-600 h-11 rounded-xl"
      >
        {isLoading && <Loader2 className="animate-spin mr-2" size={16} />}
        {isLoading ? "Processing..." : `Pay ${formattedAmount}`}
      </Button>
    </div>
  );
}
