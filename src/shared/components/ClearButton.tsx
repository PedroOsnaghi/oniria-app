import CloseIcon from "@/assets/icons/CloseIcon";

export type ClearButtonProps = {
    onClick: () => void;
    label?: string;
};

export default function ClearButton({ onClick, label = "Limpiar" }: ClearButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={`Limpiar ${label.toLowerCase()}`}
            title="Limpiar"
            className="ml-1 inline-flex items-center justify-center h-7 w-7 rounded-full 
                border border-[var(--surface-weak)] 
                text-[var(--color-text-muted)] 
                hover:text-[var(--color-text-primary)] 
                hover:border-[var(--btn-primary-border)] 
                hover:bg-[var(--surface-weak)]
                cursor-pointer
                focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] 
                transition-all duration-300 ease-out"
        >
            <CloseIcon size={14} className="text-inherit" />
        </button>
    );
}
