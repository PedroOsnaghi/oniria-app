import BaseMenu from "../BaseMenu";
import menuFactory from "../menuFactory";
import { useEngineAPI } from "@/engine/core/context/EngineApiProvider";
import { useEngineStore } from "@/engine";
import type { MenuProps } from "../../../types/menu.types";
import { useTranslation } from "react-i18next";

export default function MenuPortal({ onClose, isClosing = false }: MenuProps) {
  const { t } = useTranslation();
  const menu = menuFactory(t).portal;
  const engine = useEngineAPI();
  const { closeMenu } = useEngineStore();

  // Handler único que procesa el click de cada item
  const handleItemClick = (itemIndex: number) => {
    switch (itemIndex) {
      case 0:
        engine.interactions.setEnabled(false);
        engine.camera.viewTravel();
        closeMenu();
        break;
      case 1:
        engine.interactions.setEnabled(false);
        engine.camera.viewNodes();
        closeMenu();
        break;
      default:
        console.warn(
          `[MenuPortal] Opción desconocida seleccionada: ${itemIndex}`
        );
    }
  };

  return (
    <BaseMenu
      menu={menu}
      onItemClick={handleItemClick}
      onClose={onClose}
      isClosing={isClosing}
    />
  );
}
