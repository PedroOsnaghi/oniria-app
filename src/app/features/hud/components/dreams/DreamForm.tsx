import DreamTextarea from "@/app/shared/components/DreamTextarea";
import HudMenu from "@/app/shared/components/menu/CardMenu";
import { useDreamInput } from "./hooks/useDreamInput";
import type { Dream, DreamFormType } from "@/engine";
import { useTranslation } from "react-i18next";
import Icon from "@/assets/icons/Icon";
import { useAuth } from "@/app/features/auth/hooks/useAuth";
import useDreamService from "./hooks/useDreamService";

interface DreamFormProps {
  maxChars?: number;
  onClose?: () => void;
  type: DreamFormType;
  data?: Dream | null;
}

export default function DreamForm({
  maxChars = 1200,
  onClose,
}: DreamFormProps) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { dream, dreamRef, handleTextChange, charsLeft, isTooLong, isEmpty } =
    useDreamInput({
      maxChars,
    });

  const { handleInterpret: interpretDream, loading } = useDreamService();

  const handleClose = () => {
    onClose?.();
  };

  const handleInterpret = async () => {
    try {
      // Llamar al servicio que adaptará y guardará en el store
      await interpretDream(dream);
      // El DreamManager se abrirá automáticamente al detectar que hay un Dream en el store
    } catch (error) {
      console.error("[DreamForm] Error al interpretar el sueño:", error);
    }
  };

  return (
    <HudMenu.Root className="flex items-start h-full gap-3 shrink-0">
      <HudMenu.Container className="w-96 max-w-full h-full flex pb-5 flex-col gap-4 ">
        <HudMenu.Header>
          <div className="flex items-center justify-between w-full">
            <h2 className="text-xl font-semibold font-orbitron text-primary ">
              {"VITACORA"}
            </h2>
            <HudMenu.CloseButton onClick={handleClose} />
          </div>
        </HudMenu.Header>

        <HudMenu.Body>
          <h2 className="text-sm">
            Hola {user?.user_metadata.full_name ?? "Invitado"}, ¿Qué imágenes
            quedaron de tu sueño?
          </h2>
          <p className="text-xs text-text-muted">
            Escribí libremente, sin preocuparte por el orden. Oniria se
            encargará de interpretarlo.
          </p>
          <DreamTextarea
            ref={dreamRef}
            value={dream}
            onChange={handleTextChange}
            maxChars={maxChars}
            charsLeft={charsLeft}
            isTooLong={isTooLong}
          />
        </HudMenu.Body>
        <HudMenu.Footer className="flex justify-end">
          <button
            onClick={handleInterpret}
            disabled={isEmpty || isTooLong || loading}
            className="modal-button"
          >
            <span
              className={`flex items-center gap-2 text-light ${
                isEmpty || isTooLong || loading ? "opacity-80" : "opacity-100"
              }`}
            >
              {loading ? (
                <Icon name="spinner" className="text-xs w-5 h-5 animate-spin" />
              ) : (
                <Icon name="magic" className="text-xs w-5 h-5" />
              )}
              {loading ? "Interpretando..." : t("node.interpretar")}
            </span>
          </button>
        </HudMenu.Footer>
      </HudMenu.Container>
      <HudMenu.Description className="text-sm max-w-sm">
        Estás en la Vitácora Onírica, el lugar donde los sueños toman forma.
        Cada palabra que escribas deja una huella en tu mapa interior,
        conectando recuerdos, símbolos y emociones. Este es tu espacio para
        registrar lo que el subconsciente te mostró mientras dormías.
      </HudMenu.Description>
    </HudMenu.Root>
  );
}
