import Card from "@/shared/components/Card";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { getRandomQuote } from "@/services/home/home.service";
import '../styles/LeftPanel.css';
import DreamTextarea from "@/shared/components/DreamTextarea";
import BadgeIcon from "@/assets/icons/BadgeIcon";
import SettingsIcon from "@/assets/icons/SettingsIcon";
import MenuButton from "@/shared/components/MenuButton";
import ClockIcon from "@/assets/icons/ClockIcon";
import CtaButton from "@/shared/components/CtaButton";
import QuoteCard from "@/shared/components/QuoteCard";

type LeftPanelProps = {
  onInterpretar?: (_dream: string) => void;
  onPersonalizar?: () => void;
  onInsignias?: () => void;
  initialDream?: string;
  maxChars?: number;
  onNuevaFrase?: () => void;
  quote?: string;
  loadingQuote?: boolean;
  showQuoteCard?: boolean;
};

export default function LeftPanel({
  onInterpretar,
  onPersonalizar,
  onInsignias,
  initialDream = "",
  maxChars = 1200,
  onNuevaFrase,
  quote = "Lo que no se nombra, se sueña",
  loadingQuote = false,
  showQuoteCard = true,
}: LeftPanelProps) {
  const [dream, setDream] = useState(initialDream);
  const charsLeft = useMemo(() => maxChars - dream.length, [dream, maxChars]);
  const isEmpty = dream.trim().length === 0;
  const isTooLong = dream.length > maxChars;
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [quoteText, setQuoteText] = useState(quote);
  const [isLoadingQ, setIsLoadingQ] = useState(loadingQuote || false);

  const handleNuevaFrase = async () => {
    setIsLoadingQ(true);
    try {
      const q = await getRandomQuote();
      setQuoteText(q);
      onNuevaFrase?.();
    } finally {
      setIsLoadingQ(false);
    }
  };

  return (
    <Card className="col-span-12 md:col-span-3 min-w-[300px] p-6 h-[88vh] overflow-hidden text-[15px] space-y-4">
      {/* Dream Input Section */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-black/15">
        <DreamTextarea
          value={dream}
          onChange={setDream}
          maxChars={maxChars}
          charsLeft={charsLeft}
          isTooLong={isTooLong}
        />

        <button
          onClick={() => {
            if (!isEmpty && !isTooLong) {
              onInterpretar?.(dream.trim());
              navigate("/node", { state: { dream: dream.trim() } });
            }
          }}
          disabled={isEmpty || isTooLong}
          className="tap-button mt-4 w-full rounded-xl bg-gradient-to-r from-fuchsia-700 to-fuchsia-600
                     px-4 py-3 text-[14px] font-bold border border-fuchsia-400/30
                     shadow-[0_0_22px_rgba(217,70,239,0.35)]
                     disabled:opacity-60 disabled:cursor-not-allowed
                     transition-transform duration-200"
        >
          <span className="inline-flex items-center gap-2">
            {t("node.interpretar")}
          </span>
        </button>
      </div>

      {/* Quote Card */}
      {showQuoteCard && (
        <QuoteCard
          quote={quoteText}
          isLoading={isLoadingQ}
          onRefresh={handleNuevaFrase}
        />
      )}

      {/* Menu Section */}
      <div className="px-4 sm:px-5 pb-45 rounded-2xl bg-white/5 border border-white/15">
        <div className="text-[12px] mt-4 font-semibold text-white/80 mb-3">
          {t("node.myroom")}
        </div>

        <MenuButton
          icon={<SettingsIcon />}
          title={t("node.personalizar")}
          description={t("node.toque")}
          onClick={onPersonalizar || (() => { })}
        />

        <MenuButton
          icon={<BadgeIcon />}
          title={t("node.insignia")}
          description={t("node.descriptionInsignia")}
          onClick={onInsignias || (() => { })}
        />

        <MenuButton
          icon={<ClockIcon />}
          title={t("historial.link")}
          description={t("historial.verSuenos")}
          onClick={() => navigate("/historial")}
        />
      </div>

      {/* CTA PRO */}
      <CtaButton
        ctaText={t("historial.oniriaPro")}
        onClick={() => console.log("CTA click")}
        disabled={false}
        pressed={false}
      />
    </Card>
  );
}