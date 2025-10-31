import { useTranslation } from "react-i18next";
import Icon from "@/assets/icons/Icon";

export type SaveState = "idle" | "saving" | "saved";
export type ImageGenerationState = "idle" | "generating" | "generated";

type ActionsProps = {
  onSave: () => void | Promise<void>;
  onReinterpret: () => void;
  onGenerateImage?: () => void;
  onDownloadImage?: () => void;
  visibility?: boolean;
  saveState: SaveState;
  imageState?: ImageGenerationState;
};

export default function Actions({
  onSave,
  onReinterpret,
  onGenerateImage,
  onDownloadImage,
  visibility = true,
  saveState,
  imageState = "idle",
}: ActionsProps) {
  const { t } = useTranslation();

  const handleSave = async () => {
    if (saveState !== "idle") return; // Prevenir clicks múltiples
    try {
      const res: any = await onSave();
      const ok = res?.ok ?? true; // Asumir éxito si no hay respuesta
      if (!ok) throw new Error("save failed");
    } catch (error) {
      console.error("Error saving:", error);
    }
  };

  const getSaveButtonText = () => {
    switch (saveState) {
      case "saving":
        return t("node.panelImage.guardando");
      case "saved":
        return t("node.panelImage.guardado");
      default:
        return t("node.guardar");
    }
  };

  const getSaveButtonClass = () => {
    let baseClass = "modal-button modal-button-save";
    if (saveState === "saved") baseClass += " modal-button-saved";
    else if (saveState === "saving") baseClass += " modal-button-saving";
    return baseClass;
  };

  const renderIcon = () => {
    if (saveState === "saving")
      return <Icon name="spinner" className="animate-spin" />;
    if (saveState === "saved") return <Icon name="check" />;
    return <Icon name="save" />;
  };

  const getImageButtonText = () => {
    switch (imageState) {
      case "generating":
        return "Generando...";
      case "generated":
        return "Listo";
      default:
        return "Generar imagen";
    }
  };

  const renderImageIcon = () => {
    if (imageState === "generating")
      return <Icon name="spinner" className="animate-spin" />;
    if (imageState === "generated") return <Icon name="check" />;
    return <Icon name="image" />;
  };

  return (
    <div
      className="modal-actions"
      style={{ display: visibility ? "flex" : "none" }}
    >
      <button
        onClick={handleSave}
        className={getSaveButtonClass()}
        disabled={saveState !== "idle"}
      >
        <span className="inline-flex items-center gap-2">
          {renderIcon()}
          <span>{getSaveButtonText()}</span>
        </span>
      </button>

      {onGenerateImage && (
        <button
          onClick={onGenerateImage}
          className={`modal-button ${
            imageState === "generated" ? "modal-button-saved" : ""
          }`}
          disabled={imageState !== "idle"}
        >
          <span className="inline-flex items-center gap-2">
            {renderImageIcon()}
            <span>{getImageButtonText()}</span>
          </span>
        </button>
      )}

      {imageState === "generated" && onDownloadImage && (
        <button
          onClick={onDownloadImage}
          className="modal-button modal-button-save"
        >
          <span className="inline-flex items-center gap-2">
            <Icon name="download" />
            <span>Guardar imagen</span>
          </span>
        </button>
      )}

      <button
        onClick={onReinterpret}
        className="modal-button modal-button-reinterpret"
      >
        <Icon name="sparkles" />
        {t("node.reinterpretar")}
      </button>
    </div>
  );
}
