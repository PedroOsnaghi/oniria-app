import ModalActions, {
  type SaveState,
  type ImageGenerationState,
} from "@/app/features/dreams/components/Actions";
import HudMenu from "@/app/shared/components/menu/CardMenu";
import Badge from "@/app/shared/components/Badge";
import { useCallback, useEffect, useRef, useState } from "react";
import { useEngineStore } from "@/engine";
import useDreamService from "./hooks/useDreamService";
import { useEngineAPI } from "../../../engine/core/context/EngineApiProvider";
import { downloadUrlAsFile, suggestFilename } from "./DownloadHanlde";
import { useTranslation } from "react-i18next";

interface DreamManagerProps {
  visibility?: boolean;
  actionsVisible?: boolean;
  typingSpeed?: number; // caracteres por segundo
  onClose?: () => void;
  onSave?: () => void;
  onReinterpret?: () => void;
}

export default function DreamManager({
  actionsVisible = true,
  typingSpeed = 40,
  onClose,
  onSave,
  onReinterpret,
}: DreamManagerProps) {
  // Obtener el dream del store
  const dream = useEngineStore((state) => state.dream);
  const service = useDreamService();
  const textRef = useRef<HTMLDivElement>(null);
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentText, setCurrentText] = useState(""); // Para trackear cambios de texto
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [imageState, setImageState] = useState<ImageGenerationState>("idle");
  const [showCloseBadge, setShowCloseBadge] = useState(false);
  const hasInitialized = useRef(false); // Para controlar la primera animación
  const engine = useEngineAPI();
  const { t } = useTranslation();

  const startTypingAnimation = useCallback(
    (fullText: string, speed: number) => {
      const cleanText = fullText
        .replace(/^undefined/i, "")
        .replace(/undefined$/i, "")
        .trim();

      if (!cleanText) return;

      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);

      setDisplayedText("");
      setIsTyping(true);

      let currentIndex = 0;
      const intervalTime = 1000 / speed;

      setTimeout(() => {
        typingIntervalRef.current = setInterval(() => {
          setDisplayedText((prev) => {
            if (currentIndex < cleanText.length) {
              const next = prev + cleanText[currentIndex];
              currentIndex++;
              return next;
            } else {
              clearInterval(typingIntervalRef.current!);
              typingIntervalRef.current = null;
              setIsTyping(false);
              return prev;
            }
          });
        }, intervalTime);
      }, 50);
    },
    []
  );

  // Handler para guardar
  const handleSave = async () => {
    setSaveState("saving");

    if (!dream) {
      console.error("[DreamManager] No hay Nodo para guardar");
      setSaveState("idle");
      return;
    }
    await service.saveDream(dream);

    onSave?.();
    setSaveState("saved");
  };

  // Handler para reinterpretar
  const handleReinterpret = useCallback(() => {
    onReinterpret?.();
    setShowCloseBadge(false);
    setSaveState("idle");
  }, [onReinterpret]);

  // Handler para cerrar
  const handleClose = useCallback(() => {
    // Si no se ha guardado, mostrar badge de confirmación
    if (saveState !== "saved") {
      setShowCloseBadge(true);
    } else {
      // Si hay imagen visible, iniciar cierre y esperar a que termine la animación
      if (imageState === "generated") {
        engine.image.hide();
        // Esperar al evento image:destroyed antes de cerrar
        engine.image.onDestroyed(() => {
          onClose?.();
        });
      } else {
        onClose?.();
      }
    }
  }, [saveState, imageState, engine, onClose]);

  // Handler para confirmar cierre sin guardar
  const handleConfirmClose = useCallback(() => {
    // Si hay imagen visible, iniciar cierre y esperar a que termine la animación
    if (imageState === "generated") {
      engine.image.hide();
      // Esperar al evento image:destroyed antes de cerrar
      engine.image.onDestroyed(() => {
        onClose?.();
      });
    } else {
      onClose?.();
    }
  }, [imageState, engine, onClose]);

  // Handler para cancelar cierre
  const handleCancelClose = useCallback(() => {
    setShowCloseBadge(false);
  }, []);

  // Handler para generar imagen
  const handleGenerateImage = useCallback(() => {
    if (!dream?.imageUrl) return;

    setImageState("generating");
    // Llamar al engine para mostrar la imagen
    engine.image.show(dream.imageUrl);
  }, [dream, engine]);

  // Handler para descargar imagen
  const handleDownloadImage = useCallback(async () => {
    if (!dream?.imageUrl) return;

    const fileName = suggestFilename(
      dream.imageUrl,
      `dream-${dream.title || "interpretation"}`
    );

    await downloadUrlAsFile(dream.imageUrl, fileName);
  }, [dream]);

  // Escuchar evento de imagen lista
  useEffect(() => {
    if (!engine) return;

    // Suscribirse al evento usando la API pública
    engine.image.onReady(() => {
      console.log("[DreamManager] Imagen lista");
      setImageState("generated");
    });
  }, [engine]);

  // Efecto para iniciar la animación al montar o cuando cambia el dream
  useEffect(() => {
    if (!dream || !dream.interpretation) return;

    const interpretationText = dream.interpretation;

    // Si es la primera vez o el texto cambió
    if (!hasInitialized.current || interpretationText !== currentText) {
      hasInitialized.current = true;
      setCurrentText(interpretationText);
      startTypingAnimation(interpretationText, typingSpeed);
    }
  }, [dream, currentText, startTypingAnimation, typingSpeed]);

  return (
    <HudMenu.Root className="w-full flex justify-end h-full">
      <HudMenu.Container className="max-w-lg h-full pb-5 w-full">
        <HudMenu.Header>
          <div className="flex items-center justify-between w-full">
            <h2 className="text-xl font-semibold font-orbitron text-primary ">
              {dream?.title || "INTERPRETACIÓN"}
            </h2>
            <HudMenu.CloseButton onClick={handleClose} />
          </div>
        </HudMenu.Header>
        <HudMenu.Body>
          <div className="modal-content overflow-y-scroll scrollbar flex-1">
            <div
              ref={textRef}
              className="text-light/75 font-normal leading-relaxed"
              style={{ minHeight: "300px" }}
            >
              {displayedText}
              {isTyping && (
                <span
                  style={{
                    marginLeft: "2px",
                    animation: "blinkCursor 1s infinite",
                    display: "inline-block",
                  }}
                >
                  |
                </span>
              )}
            </div>
          </div>
          {/* Badge para confirmar cierre sin guardar */}
          {showCloseBadge && (
            <Badge
              message={t("node.portal.tassSeguro")}
              variant="warning"
              confirmText={t("node.portal.cerrarG")}
              cancelText={t("node.portal.cancelar")}
              onConfirm={handleConfirmClose}
              onCancel={handleCancelClose}
            />
          )}

          {/* Badge de nueva funcionalidad - Generación de imagen */}
          <Badge
            title={
              saveState === "saved" && imageState === "generated"
                ? t("node.panelImage.imagenLista")
                : saveState === "saved" && imageState === "generating"
                ? t("node.panelImage.generandoImagen")
                : saveState === "saved"
                ? t("node.panelImage.interpretacionGuardada")
                : t("node.panelImage.title")
            }
            message={
              saveState === "saved" && imageState === "generated"
                ? t("node.panelImage.imagenTransform")
                : saveState === "saved" && imageState === "generating"
                ? t("node.panelImage.imagenVisual")
                : saveState === "saved"
                ? t("node.panelImage.tranformacionUnica")
                : t("node.panelImage.description")
            }
            variant="feature"
            linkText={saveState !== "saved" ? t("node.panelImage.saberMas") : undefined}
            onLinkClick={
              saveState !== "saved"
                ? () => {
                    console.log(
                      "[DreamManager] Learn more about image generation"
                    );
                    // TODO: Abrir modal o navegación con info de la feature
                  }
                : undefined
            }
            confirmText={
              saveState === "saved" && imageState === "idle"
                ? t("node.panelImage.generarImagen")
                : saveState === "saved" && imageState === "generating"
                ? t("node.panelImage.generandoImagen")
                : saveState === "saved" && imageState === "generated"
                ? t("node.panelImage.download")
                : undefined
            }
            onConfirm={
              saveState === "saved" && imageState === "idle"
                ? handleGenerateImage
                : saveState === "saved" && imageState === "generated"
                ? handleDownloadImage
                : undefined
            }
            isLoading={saveState === "saved" && imageState === "generating"}
            showButtons={saveState === "saved"}
          />
        </HudMenu.Body>
        <HudMenu.Footer className="flex justify-end">
          <ModalActions
            onSave={handleSave}
            onReinterpret={handleReinterpret}
            visibility={actionsVisible}
            saveState={saveState}
          />
        </HudMenu.Footer>
      </HudMenu.Container>
    </HudMenu.Root>
  );
}
