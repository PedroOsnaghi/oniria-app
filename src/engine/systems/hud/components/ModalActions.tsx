import SaveIcon from "@/assets/icons/SaveIcon";
import SparklesIcon from "@/assets/icons/SparklesIcon";
import { useTranslation } from "react-i18next";
import { useState } from "react";

type SaveState = "idle" | "saving" | "saved";

type ModalActionsProps = {
  onSave: () => void | Promise<void>;
  onReinterpret: () => void;
  visibility?: boolean;
};

export default function ModalActions({
  onSave,
  onReinterpret,
  visibility = true,
}: ModalActionsProps) {
  const { t } = useTranslation();
  const [saveState, setSaveState] = useState<SaveState>("idle");

  const handleSave = async () => {
    if (saveState !== "idle") return; // Prevenir clicks múltiples

    setSaveState("saving");

    try {
      await onSave();
      setSaveState("saved");
    } catch (error) {
      console.error("Error saving:", error);
      setSaveState("idle"); // Volver al estado inicial si hay error
    }
  };

  const getSaveButtonText = () => {
    switch (saveState) {
      case "saving":
        return "Guardando...";
      case "saved":
        return "Guardado";
      default:
        return "Guardar";
    }
  };

  const getSaveButtonClass = () => {
    let baseClass = "modal-button modal-button-save";

    if (saveState === "saved") {
      baseClass += " modal-button-saved";
    } else if (saveState === "saving") {
      baseClass += " modal-button-saving";
    }

    return baseClass;
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
        <SaveIcon />
        {getSaveButtonText()}
      </button>

      <button
        onClick={onReinterpret}
        className="modal-button modal-button-reinterpret"
      >
        <SparklesIcon />
        {t("node.reinterpret")}
      </button>
    </div>
  );
}
