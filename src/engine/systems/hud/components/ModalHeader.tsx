import CloseIcon from "@/assets/icons/CloseIcon";
import { useTranslation } from "react-i18next";
import "@engine/systems/hud/components/styles/DreamCardModal.css";

type ModalHeaderProps = {
  title: string;
  onClose: () => void;
};

export default function ModalHeader({ title, onClose }: ModalHeaderProps) {
  const { t } = useTranslation();

  return (
    <div className="modal-header">
      <div className="modal-title">{title}</div>
      <button
        onClick={onClose}
        className="modal-close-button"
        aria-label={t("node.cerrar")}
      >
        <CloseIcon className="text-white/80" />
      </button>
    </div>
  );
}
