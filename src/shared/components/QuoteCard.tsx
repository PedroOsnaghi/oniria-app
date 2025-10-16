import { useTranslation } from "react-i18next";
import QuoteIcon from "@/assets/icons/QuoteIcon";
import RefreshIcon from "@/assets/icons/RefreshIcon";
import Card from "@/shared/components/Card";

type QuoteCardProps = {
  quote: string;
  isLoading: boolean;
  onRefresh: () => void;
};

export default function QuoteCard({
  quote,
  isLoading,
  onRefresh,
}: QuoteCardProps) {
  const { t } = useTranslation();

  return (
    <Card.Root
      style={{
        backgroundColor: "var(--quote-bg)",
        borderColor: "var(--quote-border)",
      }}
    >
      <Card.Title style={{ color: "var(--quote-title)" }}>
        {t("node.todaysPhrase", "Frase de hoy")}
      </Card.Title>

      <Card.Description style={{ color: "var(--quote-hint)" }}>
        {t("node.phraseHint", "Un guiño simbólico para arrancar..")}
      </Card.Description>

      <Card.Body>
        <div
          className="rounded-xl border px-3 py-4 mb-3"
          style={{
            backgroundColor: "var(--quote-box-bg)",
            borderColor: "var(--quote-box-border)",
          }}
        >
          <div className="flex items-start gap-2 justify-center text-center">
            <QuoteIcon className="scale-x-[-1] mt-0.5 opacity-70 shrink-0" />
            <span
              className="text-[13px] leading-snug"
              style={{ color: "var(--quote-text)" }}
            >
              {quote}
            </span>
            <QuoteIcon className="rotate-360 mt-0.5 opacity-70 shrink-0" />
          </div>
        </div>

        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="tap-button w-full rounded-xl px-4 py-3 text-[14px] font-semibold border transition-transform duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
          style={{
            background: `linear-gradient(to right, var(--btn-refresh-from), var(--btn-refresh-to))`,
            borderColor: "var(--btn-refresh-border)",
            boxShadow: "var(--btn-refresh-shadow)",
          }}
        >
          <span className="inline-flex items-center gap-2">
            <RefreshIcon spinning={isLoading} />
            {t("node.newPhrase", "Nueva frase")}
          </span>
        </button>
      </Card.Body>
    </Card.Root>
  );
}
