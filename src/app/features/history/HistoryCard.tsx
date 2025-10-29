import { useHistoryPanel } from "@/app/features/history/hooks/useHistoryPanel";
import { TimelineProgressBar } from "@/app/features/history/timeLine/TimelineProgressBar";
import { TimelineList } from "@/app/features/history/timeLine/TimelineList";
import CtaButton from "@/app/shared/components/CtaButton";
import HudMenu from "@/app/shared/components/menu/CardMenu";
import SidebarHeader from "../hud/components/history/SidebarHeader";
import type { TimelineItem } from "./model/TimelineItem";

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
};

export function HistoryCard(props: HistoryVariantProps) {
  const { title, description, ctaText, timeline, loading = false } = props;

  const {
    items,
    selectedId,
    handleSelect,
    handleCTA,
    ctaPressed,
    listRef,
    itemRefs,
    progress,
    barHeight,
  } = useHistoryPanel({
    timeline,
    initialSelectedId: props.initialSelectedId,
    onSelectItem: props.onSelectItem,
    onCta: props.onCta,
    ctaDisabled: props.ctaDisabled,
  });

  return (
    <HudMenu.Root className="flex items-start h-fit gap-3">
      <HudMenu.Container className="w-96 max-w-full flex pb-5 flex-col gap-4 mt-20 ml-20">

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
              <CtaButton
                ctaText={ctaText}
                onClick={handleCTA}
                disabled={props.ctaDisabled}
                pressed={ctaPressed}
              />
            </div>
          </>
        )}
      </HudMenu.Container>
    </HudMenu.Root>
  );
}