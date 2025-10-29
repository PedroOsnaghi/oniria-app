import { useHistoryPanel } from "@/app/features/history/hooks/useHistoryPanel";
import { TimelineProgressBar } from "@/app/features/history/timeLine/TimelineProgressBar";
import { TimelineList } from "@/app/features/history/timeLine/TimelineList";
import HudMenu from "@/app/shared/components/menu/CardMenu";
import type { TimelineItem } from "../../model/TimelineItem";

type HistoryVariantProps = {
  title: string;
  description: string;
  timeline?: TimelineItem[];
  initialSelectedId?: number;
  onSelectItem?: (_item: TimelineItem) => void;
  onCta?: (_item: TimelineItem) => void;
  ctaDisabled?: boolean;
  loading?: boolean;
};

export function HistoryCard(props: HistoryVariantProps) {
  const { title, description, timeline = [], loading = false } = props;

  const {
    items,
    selectedId,
    handleSelect,
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
    <HudMenu.Root className="">
      <HudMenu.Container className="">

        <div className="text-[15px] font-semibold text-white/85">
          {title}
        </div>
        <div className="text-[12px] text-white/50">
          {description}
        </div>

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
          </>
        )}
      </HudMenu.Container>
    </HudMenu.Root>
  );
}