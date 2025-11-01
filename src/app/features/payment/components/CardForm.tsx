import { useEffect, useState } from "react";
import { useMercadoPago } from "../hooks/useMercadoPago";
import type { Session } from "@supabase/supabase-js";
import ModalButton from "@/app/shared/components/ModalButton";
import Icon from "@/assets/icons/Icon";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  const { init, processPayment, loading, error } = useMercadoPago();
  const [mp, setMp] = useState<any>(null);
  const [paymentMethodId, setPaymentMethodId] = useState<string>("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardLogo, setCardLogo] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<"approved" | "in_process" | "rejected" | null>(null);
  const navigate = useNavigate();

  const publicKey = import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY!;
  const payerEmail = session.user.email!;

  useEffect(() => {
    init(publicKey).then(setMp);
  }, []);

  async function handleCardNumberChange(value: string) {
    const cleanValue = value.replace(/\D/g, "");
    const formatted = cleanValue.match(/.{1,4}/g)?.join(" ") || cleanValue;
    setCardNumber(formatted);

    if (cleanValue.length >= 6 && mp) {
      try {
        const bin = cleanValue.substring(0, 6);
        const methods = await mp.getPaymentMethods({ bin });

        if (methods.results?.length > 0) {
          const method = methods.results[0];
          setPaymentMethodId(method.id);
          setCardLogo(method.thumbnail || null);
        } else {
          setPaymentMethodId("");
          setCardLogo(null);
        }
      } catch {
        setPaymentMethodId("");
        setCardLogo(null);
      }
    } else {
      setPaymentMethodId("");
      setCardLogo(null);
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

      const tokenResponse = await mp.createCardToken(cardData);
      if (!tokenResponse?.id)
        throw new Error("Error al crear el token de la tarjeta");

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

      if (data) {
        onSuccess(data);
        if (data.message?.includes("aprobado")) setPaymentStatus("approved");
        else if (data.message?.includes("proceso")) setPaymentStatus("in_process");
        else setPaymentStatus("rejected");
      }
    } catch (err: any) {
      console.error(err);
      console.log(error);
      setPaymentStatus("rejected");
    }
  }

  return (
    <div className="relative w-full max-w-full overflow-hidden">
      <div
        className={`w-full transition-all duration-500 ${
          paymentStatus ? "translate-x-[-100%] opacity-0" : "translate-x-0 opacity-100"
        }`}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 m-1 min-w-30">
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-400">{t("payment.cardNumber")}</label>
            <div className="relative">
              <input
                title="cardNumber"
                name="cardNumber"
                placeholder="5031 4332 1540 6351"
                value={cardNumber}
                onChange={(e) => handleCardNumberChange(e.target.value)}
                maxLength={19}
                required
                className="p-2 pr-10 rounded-lg bg-gray-800 text-white w-full focus:ring-2 focus:ring-fuchsia-500 outline-none"
              />
              {cardLogo && (
                <img
                  src={cardLogo}
                  alt="Card logo"
                  className="absolute right-3 top-2 h-6 w-8 object-contain"
                />
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-400">{t("payment.cardholderName")}</label>
            <input
              title="cardholderName"
              name="cardholderName"
              placeholder="JUAN PEREZ"
              required
              className="p-2 rounded-lg bg-gray-800 text-white uppercase focus:ring-2 focus:ring-fuchsia-500 outline-none"
            />
          </div>

          <div className="flex gap-2">
            <div className="flex flex-col gap-1 w-2/3">
              <label className="text-sm text-gray-400">{t("payment.expiration")}</label>
              <div className="flex items-center bg-gray-800 rounded-lg px-2 focus-within:ring-2 focus-within:ring-fuchsia-500">
                <input
                  title="expirationMonth"
                  name="expirationMonth"
                  placeholder="11"
                  maxLength={2}
                  pattern="[0-9]{2}"
                  required
                  className="bg-transparent w-1/2 p-2 text-center outline-none"
                />
                <span className="text-gray-500">/</span>
                <input
                  title="expirationYear"
                  name="expirationYear"
                  placeholder="30"
                  maxLength={2}
                  pattern="[0-9]{2}"
                  required
                  className="bg-transparent w-1/2 p-2 text-center outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1 w-1/3">
              <label className="text-sm text-gray-400">CVV</label>
              <input
                type="password"
                title="securityCode"
                name="securityCode"
                placeholder="123"
                maxLength={4}
                pattern="[0-9]{3,4}"
                required
                className="p-2 rounded-lg bg-gray-800 text-white text-center focus:ring-2 focus:ring-fuchsia-500 outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-400">{t("payment.dni")}</label>
            <input
              title="identificationNumber"
              name="identificationNumber"
              placeholder="12345678"
              pattern="[0-9]{7,8}"
              required
              className="p-2 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-fuchsia-500 outline-none"
            />
          </div>

          <ModalButton
            type="submit"
            disabled={loading || !paymentMethodId}
          >
            {loading ? t("payment.processing") : t("payment.pay")}
          </ModalButton>
        </form>
      </div>

      <div
        className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
          paymentStatus ? "translate-x-0 opacity-100" : "translate-x-[100%] opacity-0"
        }`}
      >
        {paymentStatus && (
          <div className="text-center space-y-6 px-4">
            <div
              className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${
                paymentStatus === "approved"
                  ? "bg-green-500/20"
                  : paymentStatus === "in_process"
                  ? "bg-yellow-500/20"
                  : "bg-red-500/20"
              }`}
            >
              <Icon
                name={
                  paymentStatus === "approved"
                    ? "check"
                    : paymentStatus === "in_process"
                    ? "clock"
                    : "close"
                }
                size={32}
                className={
                  paymentStatus === "approved"
                    ? "text-green-400"
                    : paymentStatus === "in_process"
                    ? "text-yellow-400"
                    : "text-red-400"
                }
              />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white">
                {t(`payment.status.${paymentStatus}.title`)}
              </h3>
              <p className="text-white/70">
                {t(`payment.status.${paymentStatus}.message`)}
              </p>
            </div>

            <ModalButton
              type="button"
              onClick={() =>
                paymentStatus === "approved"
                  ? navigate("/")
                  : setPaymentStatus(null)
              }
              icon={<Icon name="arrow" size={18} />}
            >
              {t(`payment.status.${paymentStatus}.button`)}
            </ModalButton>
          </div>
        )}
      </div>
    </div>
  );
}
