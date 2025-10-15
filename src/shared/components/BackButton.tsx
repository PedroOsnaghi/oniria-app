import { useTranslation } from "react-i18next";

interface BackButtonProps {
    onClick: () => void;
    label?: string;
}

export default function BackButton({ onClick, label }: BackButtonProps) {
    const { t } = useTranslation();
    const buttonLabel = label || t("history.returnHome", "Volver a home");

    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={buttonLabel}
            className="inline-flex w-fit max-w-fit !w-auto self-start
                mb-0 inline-flex items-center gap-2 text-[13px] font-semibold 
                 px-3 py-[6px] rounded-full border border-[var(--surface-weak)]
                 hover:bg-[var(--surface-weak)] hover:text-[var(--color-text-primary)] 
                 transition-all duration-300 ease-out"
        >
            ← {buttonLabel}
        </button>
    );
}
