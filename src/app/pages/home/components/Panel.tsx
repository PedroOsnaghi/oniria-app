import { useHistoryPanel } from "@/app/features/history/hooks/useHistoryPanel";
import type { TimelineItem } from "@/app/features/history/model/TimelineItem";
import SidebarHeader from "../../history/components/SidebarHeader";
import Card from "@/shared/components/Card";
import { TimelineProgressBar } from "@/app/features/history/timeLine/TimelineProgressBar";
import { TimelineList } from "@/app/features/history/timeLine/TimelineList";
import CtaButton from "@/shared/components/CtaButton";
import { useTranslation } from "react-i18next";
import { useHomePanel } from "@/app/features/home/hooks/useHomePanel";
import DreamTextarea from "@/shared/components/DreamTextarea";
import QuoteCard from "@/shared/components/QuoteCard";
import MenuButton from "@/shared/components/MenuButton";
import SettingsIcon from "@/assets/icons/SettingsIcon";
import BadgeIcon from "@/assets/icons/BadgeIcon";
import ClockIcon from "@/assets/icons/ClockIcon";
import BackButton from "@/shared/components/BackButton";
import EmotionFilter from "../../history/components/EmotionFilter";
import type { HistoryFilters } from "@/app/features/history/model/types";
import { useCallback, useState } from "react";

type HistoryVariantProps = {
  variant: "history";
  title: string;
  description: string;
  ctaText: string;
  timeline: TimelineItem[];
  initialSelectedId?: number;
  onSelectItem?: (_item: TimelineItem) => void;
  onCta?: (_item: TimelineItem) => void;
  ctaDisabled?: boolean;
  loading?: boolean;
  onChangeFilters?: (filters: HistoryFilters) => void;
};

type HomeVariantProps = {
  variant: "home";
  onInterpretar?: (_dream: string) => void;
  onPersonalizar?: () => void;
  onInsignias?: () => void;
  onBackHome?: () => void;
  initialDream?: string;
  maxChars?: number;
  onNuevaFrase?: () => void;
  quote?: string;
  loadingQuote?: boolean;
  showQuoteCard?: boolean;
  scrollable?: boolean;
};

type UnifiedSidePanelProps = HistoryVariantProps | HomeVariantProps;

function HistoryPanel(props: HistoryVariantProps) {
  const {
    title,
    description,
    ctaText,
    timeline,
    loading = false,
    onChangeFilters,
  } = props;

  const handleEmotionChange = useCallback(
    (emotions: string[]) => {
      onChangeFilters?.({
        emotion: emotions.length ? emotions : undefined,
      });
    },
    [onChangeFilters]
  );

  const {
    items,
    selectedId,
    handleSelect,
    listRef,
    itemRefs,
    progress,
    barHeight,
    selectedEmotions,
    setSelectedEmotions,
  } = useHistoryPanel({
    timeline,
    initialSelectedId: props.initialSelectedId,
    onSelectItem: props.onSelectItem,
    onCta: props.onCta,
    ctaDisabled: props.ctaDisabled,
    onEmotionChange: handleEmotionChange,
  });

  return (
    <Card.Container
      className={`col-span-12 md:col-span-3 min-w-[300px] text-[15px] space-y-3 transition-all duration-300 overflow-y-hidden`}
    >
      <SidebarHeader title={title} description={description} />

      {loading ? (
        <div className="space-y-4 flex-1">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-6 w-full rounded animate-pulse"
              style={{ backgroundColor: "var(--skeleton-bg)" }}
            />
          ))}
        </div>
      ) : (
        <>
          <EmotionFilter
            items={timeline}
            selected={selectedEmotions}
            onChange={setSelectedEmotions}
            className="sticky top-0 z-10 bg-transparent pt-1"
          />

          <div className="relative flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <TimelineProgressBar progress={progress} height={barHeight} />
            <TimelineList
              items={items}
              selectedId={selectedId}
              onSelect={handleSelect}
              listRef={listRef}
              itemRefs={itemRefs}
            />
          </div>

          <div
            className="mt-4 pt-4 border-t"
            style={{ borderColor: "var(--surface-weak)" }}
          >
            <CtaButton ctaText={ctaText} disabled={props.ctaDisabled} />
          </div>
        </>
      )}
    </Card.Container>
  );
}

function HomePanel(props: HomeVariantProps) {
  const { showQuoteCard = true } = props;
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  const {
    dream,
    dreamRef,
    charsLeft,
    isEmpty,
    isTooLong,
    handleTextChange,
    handleInterpretar,
    quoteText,
    isLoadingQuote,
    handleNuevaFrase,
    handlePersonalizar,
    handleInsignias,
    handleNavigateHistory,
  } = useHomePanel({
    initialDream: props.initialDream,
    maxChars: props.maxChars,
    onNuevaFrase: props.onNuevaFrase,
    quote: props.quote,
    loadingQuote: props.loadingQuote,
    onInterpretar: props.onInterpretar,
    onPersonalizar: props.onPersonalizar,
    onInsignias: props.onInsignias,
  });

  const onInterpretarClick = async () => {
    if (isEmpty || isTooLong) return;
    setExpanded(true);
    await handleInterpretar();
  };

  const onBackHome = () => {
    setExpanded(false);
    props.onBackHome?.();
  };

  return (
    <Card.Container
      className={`col-span-12 md:col-span-3 min-w-[300px] text-[15px] space-y-3 transition-all duration-300 overflow-y-hidden`}
      scrollable={props.scrollable}
    >
      {/* Flechita volver a home solo en modo expandido */}
      {expanded && <BackButton onClick={onBackHome} />}

      {/* Dream Input Section - se hace largo cuando expanded */}
      <Card.Root>
        <Card.Title>{t("node.title")}</Card.Title>
        <Card.Description>{t("node.descriptionLabel")}</Card.Description>
        <Card.Body
          className={`
            overflow-hidden transition-all duration-300
            ${expanded ? "min-h-[48vh]" : "min-h-[160px]"}
          `}
        >
          <DreamTextarea
            ref={dreamRef}
            value={dream}
            onChange={handleTextChange}
            maxChars={props.maxChars ?? 1200}
            charsLeft={charsLeft}
            isTooLong={isTooLong}
          />

          {!expanded && (
            <button
              onClick={onInterpretarClick}
              disabled={isEmpty || isTooLong}
              className="tap-button mt-4 w-full rounded-xl px-4 py-3 text-[14px] font-bold
                       disabled:opacity-60 disabled:cursor-not-allowed
                       transition-transform duration-200"
              style={{
                background: `linear-gradient(to right, var(--btn-primary-from), var(--btn-primary-to))`,
                border: `1px solid var(--btn-primary-border)`,
                boxShadow: `var(--btn-primary-glow)`,
              }}
            >
              <span className="inline-flex items-center gap-2">
                {t("node.interpret")}
              </span>
            </button>
          )}
        </Card.Body>
      </Card.Root>

      {/*SOLO si NO esta expandido */}
      {!expanded && showQuoteCard && (
        <QuoteCard
          quote={quoteText}
          isLoading={isLoadingQuote}
          onRefresh={handleNuevaFrase}
        />
      )}

      {!expanded && (
        <Card.Root>
          <Card.Title>{t("node.myroom")}</Card.Title>
          <Card.Description>{t("node.myroomDesc")}</Card.Description>

          <Card.Body>
            <MenuButton
              icon={<SettingsIcon />}
              title={t("node.customize")}
              description={t("node.touch")}
              onClick={handlePersonalizar}
            />

            <MenuButton
              icon={<BadgeIcon />}
              title={t("node.badges")}
              description={t("node.badgesDesc")}
              onClick={handleInsignias}
            />

            <MenuButton
              icon={<ClockIcon />}
              title={t("history.link")}
              description={t("history.seeDreams")}
              onClick={handleNavigateHistory}
            />
          </Card.Body>
        </Card.Root>
      )}

      {!expanded && (
        <CtaButton
          ctaText={t("history.oniriaPro")}
          disabled={false}
          pressed={false}
        />
      )}
    </Card.Container>
  );
}
export default function UnifiedSidePanel(props: UnifiedSidePanelProps) {
  return props.variant === "history" ? (
    <HistoryPanel {...props} />
  ) : (
    <HomePanel {...props} />
  );
}
