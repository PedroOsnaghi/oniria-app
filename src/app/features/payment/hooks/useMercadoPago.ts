import { useCallback, useEffect, useState } from "react";
import { loadMercadoPago } from "@mercadopago/sdk-js";
import type { Session } from "@supabase/supabase-js";
import supabase from "@/app/utils/supabase";

interface ProcessPaymentParams {
  cardToken: string;
  amount: number;
  description: string;
  paymentMethodId: string;
  installments: number;
  payerEmail: string;
  identificationType: string;
  identificationNumber: string;
  type: "membership" | "coins";
}

export function useMercadoPago() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
  }, []);

   const init = useCallback(async (publicKey: string) => {
    await loadMercadoPago();
    const MP = (window as any).MercadoPago;
    return new MP(publicKey, { locale: "es-AR" });
  }, []);


  async function processPayment({
    cardToken,
    amount,
    description,
    paymentMethodId,
    installments,
    payerEmail,
    identificationType,
    identificationNumber,
    type,
  }: ProcessPaymentParams) {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("http://localhost:3000/api/payments/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          transaction_amount: amount,
          token: cardToken,
          description,
          payment_method_id: paymentMethodId,
          installments,
          payer: {
            email: payerEmail,
            identification: {
              type: identificationType,
              number: identificationNumber,
            },
          },
          context: type,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Payment failed");
      }

      return data;
    } catch (err: any) {
      setError(err.message || "Unknown error");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { init, processPayment, loading, error };
}