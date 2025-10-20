import OniriaLogo from "@assets/logo/Isologotipo-blanco.png";

type HeaderLogoProps = {
    text?: string;
    onClick?: () => void;
};

export default function HeaderLogo({ onClick }: HeaderLogoProps) {
    return (
        <div
            className="header-logo flex items-center gap-2 cursor-pointer select-none"
            onClick={onClick}
        >
            <img
                src={OniriaLogo}
                alt="Oniria logo"
                className="h-8 w-auto"
            />
            {/* {text && (
                <span className="header-logo-text font-semibold text-[var(--color-text-primary)]">
                    {text}
                </span>
            )} */}
        </div>
    );
}
