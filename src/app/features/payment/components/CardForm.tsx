import { useEffect, useState } from "react";
import { useMercadoPago } from "../hooks/useMercadoPago";
import type { Session } from "@supabase/supabase-js";

interface CardFormProps {
  amount: number;
  description: string;
  type: "membership" | "coins";
  session: Session;
  onSuccess: (data: any) => void;
}

export default function CardForm({
  amount,
  description,
  type,
  session,
  onSuccess,
}: CardFormProps) {
  const { init, processPayment, loading, error } = useMercadoPago();
  const [mp, setMp] = useState<any>(null);
  const [paymentMethodId, setPaymentMethodId] = useState<string>("");
  const [cardNumber, setCardNumber] = useState("");

  const publicKey = import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY!;
  const payerEmail = session.user.email!;

  useEffect(() => {
    init(publicKey).then(setMp);
  }, []);

  async function handleCardNumberChange(value: string) {
    // Remove spaces and non-numeric characters
    const cleanValue = value.replace(/\D/g, "");
    
    // Format with spaces every 4 digits
    const formatted = cleanValue.match(/.{1,4}/g)?.join(" ") || cleanValue;
    setCardNumber(formatted);

    // Detect payment method when we have at least 6 digits
    if (cleanValue.length >= 6 && mp) {
      try {
        const bin = cleanValue.substring(0, 6);
        const methods = await mp.getPaymentMethods({ bin });
        if (methods.results?.length > 0) {
          setPaymentMethodId(methods.results[0].id);
        }
      } catch (err) {
        console.error("Error detecting payment method:", err);
        setPaymentMethodId("");
      }
    }
  }

  async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  if (!mp || !paymentMethodId) return;

  try {
    const formData = new FormData(e.target as HTMLFormElement);

    const cardData = {
      cardNumber: cardNumber.replace(/\s/g, ""),
      cardholderName: formData.get("cardholderName") as string,
      cardExpirationMonth: formData.get("expirationMonth") as string,
      cardExpirationYear: formData.get("expirationYear") as string,
      securityCode: formData.get("securityCode") as string,
      identificationType: "DNI",
      identificationNumber: formData.get("identificationNumber") as string,
    };

    console.log("Creating card token with:", cardData); // DEBUG

    const tokenResponse = await mp.createCardToken(cardData);
    
    console.log("Token response:", tokenResponse); // DEBUG

    if (!tokenResponse || !tokenResponse.id) {
      console.error("Invalid token response:", tokenResponse);
      throw new Error("Error al crear el token de la tarjeta");
    }

    console.log("Sending payment with token:", tokenResponse.id); // DEBUG

    const data = await processPayment({
      cardToken: tokenResponse.id,
      amount,
      description,
      paymentMethodId,
      installments: 1,
      payerEmail,
      identificationType: cardData.identificationType,
      identificationNumber: cardData.identificationNumber,
      type,
    });

    if (data) onSuccess(data);
  } catch (err: any) {
    console.error("Payment error:", err);
    // Show the actual error message to the user
    alert(`Error: ${err.message}`);
  }
}

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 bg-gray-800/50 p-6 rounded-xl w-96"
    >
      <input
        name="cardNumber"
        placeholder="Número de tarjeta"
        value={cardNumber}
        onChange={(e) => handleCardNumberChange(e.target.value)}
        maxLength={19} // 16 digits + 3 spaces
        required
        className="p-2 rounded bg-gray-900 text-white"
      />
      <input
        name="cardholderName"
        placeholder="Nombre del titular (como aparece en la tarjeta)"
        required
        className="p-2 rounded bg-gray-900 text-white uppercase"
      />
      <div className="flex gap-2">
        <input
          name="expirationMonth"
          placeholder="MM"
          maxLength={2}
          pattern="[0-9]{2}"
          required
          className="p-2 rounded bg-gray-900 text-white w-1/2"
        />
        <input
          name="expirationYear"
          placeholder="YY"
          maxLength={2}
          pattern="[0-9]{2}"
          required
          className="p-2 rounded bg-gray-900 text-white w-1/2"
        />
      </div>
      <input
        name="securityCode"
        placeholder="CVV"
        maxLength={4}
        pattern="[0-9]{3,4}"
        required
        className="p-2 rounded bg-gray-900 text-white"
      />
      <input
        name="identificationNumber"
        placeholder="DNI (sin puntos)"
        pattern="[0-9]{7,8}"
        required
        className="p-2 rounded bg-gray-900 text-white"
      />
      <button
        type="submit"
        disabled={loading || !paymentMethodId}
        className={`rounded-lg py-2 mt-2 text-white transition font-medium ${
          loading || !paymentMethodId
            ? "bg-gray-500 cursor-not-allowed"
            : "bg-fuchsia-500 hover:bg-fuchsia-600"
        }`}
      >
        {loading ? "Procesando..." : `Pagar $${amount}`}
      </button>
      {paymentMethodId && (
        <p className="text-sm text-green-400">
          ✓ Método detectado: {paymentMethodId}
        </p>
      )}
      {error && <p className="text-red-400 text-sm">❌ {error}</p>}
    </form>
  );
}