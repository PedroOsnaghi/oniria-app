import type { ReactNode } from "react";
import ChevronRightIcon from "../../assets/icons/ChevronRightIcon";

type MenuButtonProps = {
    icon: ReactNode;
    title: string;
    description: string;
    onClick: () => void;
    disabled?: boolean;
};

export default function MenuButton({
    icon,
    title,
    description,
    onClick,
    disabled = false,
}: MenuButtonProps) {
    const isDisabled = !!disabled;

    const bg = isDisabled
        ? "var(--menu-disabled-bg, var(--menu-bg))"
        : "var(--menu-bg)";
    const hoverBg = "var(--menu-hover-bg)";
    const border = isDisabled
        ? "var(--menu-disabled-border, var(--menu-border))"
        : "var(--menu-border)";
    const titleColor = isDisabled
        ? "var(--menu-text-title-disabled, var(--color-text-secondary))"
        : "var(--menu-text-title)";
    const descColor = isDisabled
        ? "var(--menu-text-description-disabled, var(--color-text-muted))"
        : "var(--menu-text-description)";
    const iconBg = isDisabled
        ? "var(--menu-icon-bg-disabled, var(--menu-icon-bg))"
        : "var(--menu-icon-bg)";
    const iconBorder = isDisabled
        ? "var(--menu-icon-border-disabled, var(--menu-icon-border))"
        : "var(--menu-icon-border)";
    const chevronColor = isDisabled
        ? "var(--menu-chevron-disabled, var(--color-text-muted))"
        : "var(--menu-chevron, var(--color-text-primary))";

    return (
        <button
            type="button"
            onClick={isDisabled ? undefined : onClick}
            disabled={isDisabled}
            aria-disabled={isDisabled}
            title={isDisabled ? "Próximamente…" : undefined}
            className={[
                "w-full mb-3 flex items-center justify-between rounded-xl border px-3 py-3 text-left transition-colors duration-200",
                isDisabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer",
            ].join(" ")}
            style={{
                backgroundColor: bg,
                borderColor: border,
            }}
            onMouseEnter={
                isDisabled ? undefined : (e) => (e.currentTarget.style.backgroundColor = hoverBg)
            }
            onMouseLeave={
                isDisabled ? undefined : (e) => (e.currentTarget.style.backgroundColor = bg)
            }
        >
            <div className="flex items-center gap-3">
                <div
                    className="h-9 w-9 rounded-full grid place-items-center border"
                    style={{ backgroundColor: iconBg, borderColor: iconBorder }}
                >
                    <span style={{ color: chevronColor }}>{icon}</span>
                </div>

                <div className="leading-tight min-w-0">
                    <div className="text-[12px] font-semibold truncate" style={{ color: titleColor }}>
                        {title}
                    </div>
                    <div className="text-[11px] truncate" style={{ color: descColor }}>
                        {description}
                    </div>
                </div>
            </div>

            <ChevronRightIcon
                className="transition-colors duration-200 shrink-0"
            />
        </button>
    );
}
