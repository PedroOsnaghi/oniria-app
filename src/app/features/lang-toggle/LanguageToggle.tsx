import { useTranslation } from "react-i18next";

interface LanguageToggleProps {
  className?: string;
}

export default function LanguageToggle({ className }: LanguageToggleProps) {
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
      className={`hidden h-full md:flex bg-gray-700/45 hover:bg-[var(--user-hover-bg)] items-center justify-center gap-2 rounded-full px-3 py-1.5 border border-[var(--user-border)] hover:border-[var(--user-hover-border)] transition-all duration-200 ease-out cursor-pointer backdrop-blur-2xl ${className}`}
      style={{
        minWidth: "110px", // Ancho fijo para "English" / "Español"
      }}
    >
      <div className="h-7 w-7 rounded-full grid place-items-center bg-[var(--user-icon-bg)] hover:bg-[var(--user-icon-hover-bg)] transition-colors duration-200">
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
