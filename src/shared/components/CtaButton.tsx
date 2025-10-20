import './styles/CtaButton.css';

type CtaButtonProps = {
    ctaText: string;
    disabled?: boolean;
    pressed?: boolean;
};

export default function CtaButton({
    ctaText,
    disabled = false,
}: CtaButtonProps) {
    return (
        <div className="mt-5">
            <button
                disabled={disabled}
                className={`cta-button group flex w-full items-center justify-center gap-1 rounded-xl
            bg-gradient-to-r from-[var(--btn-primary-from)] to-[var(--btn-primary-to)]
            px-6 py-4 text-[15px] font-bold shadow-[var(--btn-shadow-strong)]
            border border-[var(--btn-primary-border)]
            hover:from-[var(--btn-primary-hover-from)] hover:to-[var(--btn-primary-hover-to)]
            cursor-pointer
            disabled:opacity-60 disabled:cursor-not-allowed
            transition-all duration-200`}
                aria-disabled={disabled}
            >
                {ctaText}
                <span className="star-icon text-[var(--btn-star)] text-lg" aria-hidden="true">
                    ★
                </span>
            </button>
        </div>
    );
}