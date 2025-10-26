import { useState } from "react";
import Icon from "@/assets/icons/Icon";
import { useTranslation } from "react-i18next";

export default function UserLike() {
  const { t } = useTranslation();
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleToggleLike = async () => {
    if (loading) return;
    const next = !liked;

    setLiked(next);
    setLoading(true);

    try {
      //await likeApp(next);
    } catch (e) {
      setLiked(!next);
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={handleToggleLike}
      className="hidden h-full md:flex bg-gray-700/45 items-center gap-2 rounded-full px-3 py-1.5 border transition-all duration-200 ease-out cursor-pointer "
      style={{ borderColor: "var(--user-border)" }}
    >
      <p className="text-sm text-nowrap">{t("home.likeApp")}</p>
      <Icon
        name="unLike"
        className={`w-6 h-6 min-w-6 min-h-6 shrink-0 cursor-pointer transition-all duration-300 ease-out ${liked ? "text-red-500 scale-125 animate-heart-pop" : "text-white"}`}
      />
    </div>
  );
}
