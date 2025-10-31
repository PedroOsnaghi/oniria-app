import { useTranslation } from "react-i18next";

interface HistoryContentProps {
  loading: boolean;
  error: string | null;
}

export default function HistoryContent({
  loading,
  error,
}: HistoryContentProps) {
  const { t } = useTranslation();

  return (
    <div className="w-full mt-4">
      <div className="flex items-center justify-between">
        {loading && <span className="text-sm text-white/70">{t("historial.contentNodos.cargando")}</span>}
        {error && <span className="text-sm text-red-300">{error}</span>}
      </div>
    </div>
  );
}
