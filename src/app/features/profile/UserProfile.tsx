import { useState, useRef, useEffect } from "react";
import ChevronDownIcon from "@/assets/icons/store/ChevronDownIcon";
import UserIcon from "@/assets/icons/store/UserIcon";
import Icon from "@/assets/icons/Icon";
import { useTranslation } from "react-i18next";

type UserProfileProps = {
  name: string;
  email: string;
  onLogout?: () => void;
};

export default function UserProfile({ name, email, onLogout }: UserProfileProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await onLogout?.();
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    } finally {
      setIsLoggingOut(false);
      setIsOpen(false);
    }
  };

  return (
    <div ref={menuRef} className="relative hidden md:flex items-center">
      <div className="h-full bg-[var(--user-bg)] hover:bg-[var(--user-hover-bg)] flex items-center gap-2 rounded-full px-3 py-1.5 border border-[var(--user-border)] hover:border-[var(--user-hover-border)] transition-all duration-200 ease-out cursor-pointer backdrop-blur-xl"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="h-7 w-7 rounded-full grid place-items-center bg-[var(--user-icon-bg)] hover:bg-[var(--user-icon-hover-bg)] transition-colors duration-200">
          <UserIcon className="transition-colors duration-200" />
        </div>

        <div className="leading-tight">
          <div className="text-xs font-semibold transition-colors duration-200"
            style={{ color: "var(--user-text-primary)" }}
          >
            {name}
          </div>
          <div className="text-[10px] transition-colors duration-200"
            style={{ color: "var(--user-text-muted)" }}
          >
            {email}
          </div>
        </div>

        <ChevronDownIcon className={`transition-transform duration-200 opacity-70 ${isOpen ? "rotate-180" : ""}`}
        />
      </div>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-44 rounded-xl border border-[var(--menu-border)] bg-[var(--menu-bg)] backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.25)] overflow-hidden animate-fade-in z-50"
        >
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 text-[var(--menu-text)] hover:bg-[var(--menu-hover-bg)] transition-all duration-200 ${isLoggingOut ? "opacity-80 cursor-wait" : ""}`}
          >
            {isLoggingOut ? (
              <>
                <Icon
                  name="spinner"
                  className="w-4 h-4 animate-spin text-[var(--menu-text)]"
                />
                {t("header.closingSesion")}
              </>
            ) : (
              <>{t("header.closeSesion")}</>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
