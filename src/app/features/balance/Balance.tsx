import { useTranslation } from "react-i18next";
import Icon from "@/assets/icons/Icon";

interface BalanceProps {
    className?: string;
    balance?: number;
}

export default function Balance({ className = "", balance = 0 }: BalanceProps) {
    const { t, i18n } = useTranslation();

    const formattedBalance = balance.toLocaleString(i18n.language, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    });

    return (
        <div
            role="button"
            title={t("home.balance")}
            className={`hidden h-full md:flex bg-gray-700/45 hover:bg-[var(--user-hover-bg)] items-center justify-center gap-2 rounded-full px-3 py-1.5 border border-[var(--user-border)] hover:border-[var(--user-hover-border)] transition-all duration-200 ease-out cursor-pointer backdrop-blur-2xl ${className}`}
            style={{
                minWidth: "80px",
            }}
        >
            {/* Ícono */}
            <div className="h-8 w-8 rounded-full grid place-items-center bg-[var(--user-icon-bg)] hover:bg-[var(--user-icon-hover-bg)] transition-colors duration-200 text-yellow-400">
                <Icon name="coins" className="w-5 h-5" />
            </div>

            {/* Texto */}
            <div className="leading-tight text-left">
                <div
                    className="text-md font-bold transition-colors duration-200"
                    style={{ color: "var(--user-text-primary)" }}
                >
                    {formattedBalance}
                </div>
            </div>
        </div>
    );
}
