import { useHistoryPanel } from "@/app/features/history/hooks/useHistoryPanel";
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
  } = useHistoryPanel({
    timeline,
    initialSelectedId: props.initialSelectedId,
    onSelectItem: props.onSelectItem,
    onCta: props.onCta,
    ctaDisabled: props.ctaDisabled,
  });

  return (
    <HudMenu.Root className="flex flex-col h-full">
      <HudMenu.Container className="flex flex-col h-full">

        {/* Header */}
        <div className="mb-6 shrink-0">
          <div className="text-[15px] font-semibold text-white/90 mb-2">
            {title}
          </div>
          <div className="text-[12px] text-white/50 leading-relaxed">
            {description}
          </div>
        </div>

        {/* Timeline Container */}
        {loading ? (
          <div className="space-y-4 flex-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-6 w-full rounded animate-pulse bg-white/5"
              />
            ))}
          </div>
        ) : (
          <div className="flex-1 min-h-0 overflow-y-auto pr-2 custom-scrollbar">
            <TimelineList
              items={items}
              selectedId={selectedId}
              onSelect={handleSelect}
              listRef={listRef}
              itemRefs={itemRefs}
              progress={progress}
            />
          </div>
        )}
      </HudMenu.Container>
    </HudMenu.Root>
  );
}