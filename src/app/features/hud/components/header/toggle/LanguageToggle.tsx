import { useTranslation } from "react-i18next";

export default function LanguageToggle() {
    const { i18n } = useTranslation();
    const isEs = (i18n.language || "").toLowerCase().startsWith("es");
    const next = isEs ? "en" : "es";
    const label = isEs ? "ES" : "EN";

    const handleToggle = async () => {
        await i18n.changeLanguage(next);
        try {
            localStorage.setItem("lang", next);

        } catch (error) {
            console.error("Error saving language preference:", error);
        }
    };

    return (
        <div
            role="button"
            title={isEs ? "Cambiar a inglés" : "Switch to Spanish"}
            aria-label={isEs ? "Cambiar a inglés" : "Switch to Spanish"}
            onClick={handleToggle}
            className="hidden md:flex bg-gray-700/45 items-center gap-2 rounded-full px-3 py-1.5 border transition-all duration-200 ease-out cursor-pointer backdrop-blur-2xl"
            style={{
                borderColor: "var(--user-border)",
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--user-hover-bg)";
                e.currentTarget.style.borderColor = "var(--user-hover-border)";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "var(--user-bg)";
                e.currentTarget.style.borderColor = "var(--user-border)";
            }}
        >
            <div
                className="h-7 w-7 rounded-full grid place-items-center transition-colors duration-200"
                style={{ backgroundColor: "var(--user-icon-bg)" }}
                onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "var(--user-icon-hover-bg)")
                }
                onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "var(--user-icon-bg)")
                }
            >
                {label}
            </div>

            <div className="leading-tight">
                <div
                    className="text-xs font-semibold transition-colors duration-200"
                    style={{ color: "var(--user-text-primary)" }}
                >
                    {isEs ? "Español" : "English"}
                </div>
            </div>
        </div>
    );
}
