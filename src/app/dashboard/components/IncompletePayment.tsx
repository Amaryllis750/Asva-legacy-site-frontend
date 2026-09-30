"use client";

import { AlertCircle, ArrowRight, CheckCircle2, CreditCard, Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import usePaystackCheckout from "@/hooks/usePaystackCheckout";

export default function IncompletePayment({ email }: { email: string }) {
  const { start, isLoading, error } = usePaystackCheckout();

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 py-10 sm:px-6">
      <section className="w-full max-w-lg overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-xl shadow-black/20">
        <div className="border-b border-zinc-800 px-6 py-6 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-700">
              <CreditCard size={21} aria-hidden="true" />
            </div>
            <div>
              <h1 className="mt-1 text-xl font-bold text-white sm:text-2xl">Complete your payment</h1>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-zinc-400">
            Make your one-time account creation payment to activate your ASVA membership and access your dashboard.
          </p>
        </div>

        <div className="px-6 py-6 sm:px-8">
          <div className="rounded-xl border border-green-500/20 bg-green-500/10 px-5 py-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">Account creation fee</p>
                <p className="mt-1 text-sm font-semibold text-zinc-100">One-time payment</p>
              </div>
              <p className="shrink-0 text-2xl font-bold text-green-700">₦2,000</p>
            </div>
          </div>

          <div className="mt-5 flex items-start gap-3 rounded-xl border border-zinc-800 px-4 py-3">
            <CheckCircle2 className="mt-0.5 shrink-0 text-green-600" size={17} aria-hidden="true" />
            <p className="text-xs leading-5 text-zinc-400">
              Your payment will be processed securely through Paystack. You can choose an available payment method at checkout.
            </p>
          </div>

          {error && (
            <p role="alert" className="mt-4 flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-700">
              <AlertCircle className="mt-0.5 shrink-0" size={16} aria-hidden="true" />
              <span>{error}</span>
            </p>
          )}

          <Button
            onClick={() => {
              start({
                email,
                amount: 2000,
                description: "creating an account",
                purpose: "ACCOUNT_CREATION",
              });
            }}
            disabled={isLoading}
            aria-busy={isLoading}
            className="mt-6 h-11 w-full rounded-xl bg-green-500 text-white hover:bg-green-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={16} aria-hidden="true" />
                Preparing secure checkout...
              </>
            ) : (
              <>
                Continue to payment
                <ArrowRight size={16} aria-hidden="true" />
              </>
            )}
          </Button>

          <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-zinc-500">
            <ShieldCheck size={14} className="text-green-700" aria-hidden="true" />
            Secure payment powered by Paystack
          </p>
        </div>
      </section>
    </main>
  );
}
