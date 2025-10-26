import Icon from "@/assets/icons/Icon";
import { useTranslation } from "react-i18next";

export default function UserLike() {
  const { t } = useTranslation();
  return (
    <div
      className="hidden h-full md:flex bg-gray-700/45 items-center gap-2 rounded-full px-3 py-1.5 border transition-all duration-200 ease-out cursor-pointer backdrop-blur-2xl
      min-w-6 w-44
      "
      style={{
        borderColor: "var(--user-border)",
      }}
    >
      <p className="text-sm text-nowrap">{t("home.likeApp")}</p>
      <Icon name="unLike" className="w-6 h-6 text-white cursor-pointer" />
    </div>
  );
}
