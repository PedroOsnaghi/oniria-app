import { useEngineAPI } from "@/engine/core/context/EngineApiProvider";
import Card from "@/shared/components/Card";
import { useCallback, useEffect, useRef, useState } from "react";
import ModalHeader from "./ModalHeader";
import ModalActions from "./ModalActions";

interface DreamCardModalProps {
  visibility?: boolean;
  text?: string;
  title?: string;
  actionsVisible?: boolean;
  typingSpeed?: number; // caracteres por segundo
  onClose?: () => void;
  onSave?: () => void;
  onReinterpret?: () => void;
}

export default function DreamCardModal({
  visibility = true,
  text = "es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500...",
  title = "Dream Modal",
  typingSpeed = 50,
  actionsVisible = true,
  onClose,
  onSave,
  onReinterpret,
}: DreamCardModalProps) {
  const { animation } = useEngineAPI();

  // Referencias para animaciones
  const cardRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Estados de animación
  const [isVisible, setIsVisible] = useState(false);
  const [showHeader, setShowHeader] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentText, setCurrentText] = useState(text); // Para trackear cambios de texto

  // Animación de aparición/desaparición del modal
  const animateVisibility = useCallback(
    async (show: boolean) => {
      if (!cardRef.current || !animation) return;

      if (show) {
        // Resetear estados
        setShowHeader(false);
        setShowActions(false);
        setDisplayedText("");
        setIsTyping(false);

        const card = cardRef.current;

        // Obtener animaciones del repositorio y ejecutarlas en elementos DOM
        const animationRepo = animation.getAnimationRepository();
        const modalShowHandler = animationRepo.getAnimation("modalShow");

        if (modalShowHandler) {
          // Crear configuración mock para compatibilidad con el handler
          const config = {
            target: "modal-card",
            type: "modalShow",
            params: { duration: 0.3, ease: "power2.out" },
            loop: false,
          };

          const modalShowTl = modalShowHandler(card as any, config);

          if (modalShowTl) {
            modalShowTl
              .add(() => {
                // Hacer visible el header y animar
                setShowHeader(true);
                if (headerRef.current) {
                  const elementEnterHandler =
                    animationRepo.getAnimation("modalElementEnter");
                  if (elementEnterHandler) {
                    const elementConfig = {
                      target: "modal-header",
                      type: "modalElementEnter" as const,
                      params: { duration: 0.2, ease: "power2.out" },
                      loop: false,
                    };
                    return elementEnterHandler(
                      headerRef.current as any,
                      elementConfig
                    );
                  }
                }
              }, "-=0.1")
              .add(() => {
                // Hacer visible las acciones y animar
                setShowActions(true);
                if (actionsRef.current) {
                  const elementEnterHandler =
                    animationRepo.getAnimation("modalElementEnter");
                  if (elementEnterHandler) {
                    const elementConfig = {
                      target: "modal-actions",
                      type: "modalElementEnter" as const,
                      params: { duration: 0.2, ease: "power2.out" },
                      loop: false,
                    };
                    return elementEnterHandler(
                      actionsRef.current as any,
                      elementConfig
                    );
                  }
                }
              }, "-=0.1")
              .call(() => {
                if (text) {
                  setCurrentText(text); // Establecer el texto actual
                  setIsTyping(true);
                  startTypingAnimation(text, typingSpeed);
                }
              });
          }
        }
      } else {
        // Usar animación modalHide del repositorio
        const card = cardRef.current;

        const animationRepo = animation.getAnimationRepository();
        const modalHideHandler = animationRepo.getAnimation("modalHide");

        if (modalHideHandler) {
          const config = {
            target: "modal-card",
            type: "modalHide",
            params: { duration: 0.25, ease: "power2.in" },
            loop: false,
          };

          const modalHideTl = modalHideHandler(card as any, config);

          if (modalHideTl) {
            modalHideTl.call(() => setIsVisible(false));
          }
        }
      }
    },
    [animation, text, typingSpeed]
  );

  // Animación de typing text
  const startTypingAnimation = useCallback(
    (fullText: string, speed: number) => {
      if (!fullText) return;

      // Limpiar cualquier intervalo anterior
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
        typingIntervalRef.current = null;
      }

      setDisplayedText("");
      let currentIndex = 0;
      const intervalTime = 1000 / speed; // milisegundos por caracter

      typingIntervalRef.current = setInterval(() => {
        if (currentIndex < fullText.length) {
          setDisplayedText((prev) => prev + fullText[currentIndex]);
          currentIndex++;
        } else {
          if (typingIntervalRef.current) {
            clearInterval(typingIntervalRef.current);
            typingIntervalRef.current = null;
          }
          setIsTyping(false);
        }
      }, intervalTime);

      // Cleanup function
      return () => {
        if (typingIntervalRef.current) {
          clearInterval(typingIntervalRef.current);
          typingIntervalRef.current = null;
        }
      };
    },
    []
  );

  // Responder a cambios de visibility prop
  useEffect(() => {
    if (visibility) {
      // Si visibility es true, asegurar que isVisible también sea true
      if (!isVisible) {
        setIsVisible(true);
      }
      // Siempre ejecutar animación cuando visibility es true
      setTimeout(() => {
        if (cardRef.current) {
          animateVisibility(true);
        }
      }, 0);
    } else if (!visibility && isVisible) {
      // Si la prop cambia a false, ocultar modal
      setIsVisible(false);
    }
  }, [visibility]);

  // Responder a cambios en el texto cuando el modal ya está visible
  useEffect(() => {
    if (isVisible && text && showActions && text !== currentText) {
      // Solo actualizar si el modal ya está completamente visible Y el texto realmente cambió
      setCurrentText(text);
      setIsTyping(true);
      startTypingAnimation(text, typingSpeed);
    }
  }, [
    text,
    isVisible,
    showActions,
    currentText,
    startTypingAnimation,
    typingSpeed,
  ]);

  // Cleanup cuando el componente se desmonte
  useEffect(() => {
    return () => {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
        typingIntervalRef.current = null;
      }
    };
  }, []);

  // Handlers
  const handleClose = useCallback(() => {
    // Ejecutar animación de cierre primero
    animateVisibility(false);
    // Después de la animación, ejecutar el callback y actualizar el store
    setTimeout(() => {
      onClose?.();
    }, 250); // 250ms es la nueva duración de la animación de salida
  }, [animateVisibility, onClose]);

  const handleSave = useCallback(() => {
    onSave?.();
  }, [onSave]);

  const handleReinterpret = useCallback(() => {
    onReinterpret?.();
  }, [onReinterpret]);

  // No renderizar si no es visible
  if (!isVisible) {
    return null;
  }

  return (
    <div
      ref={cardRef}
      className="relative z-10 scale-0 origin-left translate-x-[50%]"
      style={{ transformOrigin: "left center" }}
    >
      <Card.Container className="relative flex flex-col origin-center w-[450px] max-h-[70%]  border border-white/15 bg-white/10 backdrop-blur-md p-4 sm:p-5 shadow-[0_0_35px_rgba(217,70,239,0.25)]">
        <div
          ref={headerRef}
          className={`opacity-0 -translate-y-2 transition-all duration-200 ${
            !showHeader ? "invisible" : "visible"
          }`}
        >
          <ModalHeader title={title} onClose={handleClose} />
        </div>

        <div className="modal-content overflow-y-scroll scrollbar flex-1">
          <div ref={textRef} style={{ minHeight: "300px" }}>
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

        <div
          ref={actionsRef}
          className={`opacity-0 translate-y-2 transition-all duration-200 ${
            !showActions ? "invisible" : "visible"
          }`}
        >
          <ModalActions
            onSave={handleSave}
            onReinterpret={handleReinterpret}
            visibility={actionsVisible}
          />
        </div>
      </Card.Container>
    </div>
  );
}
