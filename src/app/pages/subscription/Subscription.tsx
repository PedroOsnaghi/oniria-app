import CardForm from "@/app/features/payment/components/CardForm";
import supabase from "@/app/utils/supabase";
import type { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

export default function Subscription() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
  }, []);

  if (!session) {
    return (
      <div className="flex justify-center items-center h-screen text-white">
        Iniciá sesión para continuar
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <CardForm
        amount={5000}
        description="Suscripción Oniria Premium"
        type="membership"
        session={session}
        onSuccess={() => alert("¡Pago exitoso! 🎉")}
        // Card: 5031 4332 1540 6351
        // CVV: 123
        // Expiration: Any future date (e.g., 11/25)
        // Cardholder: APRO (or any name)
        // DNI: 12345678
      />
    </div>
  );
}
