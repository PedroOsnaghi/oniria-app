import React, { useEffect, useState, useRef } from "react";

import { useProgress } from "../hooks/useProgress";

// Interfaces
export interface LoaderProps {
  progress: number;
  isLoading: boolean;
  error: string | null;
}

export interface LoaderSystemProps {
  customLoader?: React.ComponentType<LoaderProps>;
  showProgress?: boolean;
  timeout?: number;
  // Callbacks
  onLoadStart?: () => void;
  onLoadProgress?: (_progress: number) => void;
  onLoadComplete?: () => void;
  onLoadError?: (_error: Error) => void;
}

/**
 * Loader por defecto con interfaz visual para estados de carga.
 */
function DefaultLoader({ progress, isLoading, error }: LoaderProps) {
  const [shouldHide, setShouldHide] = useState(false);

  useEffect(() => {
    if (!isLoading && !error && progress >= 100) {
      // Cuando la carga se completa, esperar un poco y luego activar desvanecimiento
      const timer = setTimeout(() => {
        setShouldHide(true);
      }, 200); // Delay de 200ms después de llegar a 100%

      return () => clearTimeout(timer);
    } else if (isLoading || error) {
      // Si vuelve a cargar o hay error, resetear estado
      setShouldHide(false);
    }
  }, [isLoading, error, progress]);

  // No renderizar si ya se desvaneció completamente
  if (shouldHide && !isLoading && !error) {
    return (
      <div className="absolute inset-0 bg-black/95 flex items-center justify-center z-[999999] text-white font-sans opacity-0 pointer-events-none transition-opacity duration-300" />
    );
  }

  return (
    <div
      className={`
        absolute inset-0 bg-black/95 flex flex-col items-center justify-center z-[999999] 
        text-white font-sans transition-all duration-300 ease-out delay-75
        ${
          shouldHide
            ? "opacity-0 scale-95 pointer-events-none"
            : "opacity-100 scale-100 pointer-events-auto"
        }
      `}
    >
      {error ? (
        <div className="text-center">
          <div className="text-2xl mb-4 text-red-400">⚠️ Error de Carga</div>
          <div className="text-base mb-6 text-gray-300">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-[var(--color-primary)] text-white border-0 rounded-lg text-base cursor-pointer hover:bg-[var(--color-primary-dark)] transition-colors"
          >
            Reintentar
          </button>
        </div>
      ) : (
        <div className="text-center">
          {/* Spinner */}
          <div className="w-12 h-12 border-4 border-white/20 border-t-[var(--color-primary)] rounded-full mx-auto mb-6 animate-spin" />

          <div className="text-xl mb-4">Cargando experiencia 3D...</div>

          {/* Progress bar */}
          <div className="w-60 h-1 bg-white/20 rounded-sm overflow-hidden mb-3">
            <div
              className="h-full bg-[var(--color-primary)] rounded-sm transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="text-base text-gray-300">
            {Math.round(progress)}% completado
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Sistema de carga del motor 3D.
 * Gestiona el estado de carga de recursos y muestra una interfaz visual apropiada.
 */
export default function LoaderSystem({
  customLoader: CustomLoader = DefaultLoader,
  showProgress = true,
  timeout = 30000,
  onLoadStart,
  onLoadProgress,
  onLoadComplete,
  onLoadError,
}: LoaderSystemProps = {}) {
  const { active: isLoading, progress, errors } = useProgress();
  const [timeoutError, setTimeoutError] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Obtener el primer error como string o null
  const error = errors.length > 0 ? errors[0] : null;

  // Añadir keyframes CSS al head
  useEffect(() => {
    const styleId = "oniria-loader-styles";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        @keyframes LoaderSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes LoaderPulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
          100% { transform: scale(1); opacity: 1; }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  // Manejar inicio y fin de la carga
  useEffect(() => {
    if (isLoading && !hasStarted) {
      setHasStarted(true);
      setTimeoutError(null);

      // Callback de inicio
      onLoadStart?.();

      // Configurar timeout por si hay errores
      if (timeout > 0) {
        timeoutRef.current = setTimeout(() => {
          const errorMsg =
            "Tiempo de carga agotado. Verifique su conexión e intente nuevamente.";
          setTimeoutError(errorMsg);
          onLoadError?.(new Error(errorMsg));
        }, timeout);
      }
    } else if (!isLoading && hasStarted) {
      setHasStarted(false);

      // Limpiar timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      if (!error && !timeoutError) {
        onLoadComplete?.();
      }
    }
  }, [
    isLoading,
    hasStarted,
    error,
    timeoutError,
    timeout,
    onLoadStart,
    onLoadComplete,
    onLoadError,
  ]);

  // Callback de progreso
  useEffect(() => {
    if (showProgress && isLoading) {
      onLoadProgress?.(progress);
    }
  }, [progress, isLoading, showProgress, onLoadProgress]);

  // Manejar errores externos
  useEffect(() => {
    if (error) {
      onLoadError?.(new Error(error));
    }
  }, [error, onLoadError]);

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Determinar estado final
  const finalError = timeoutError || error;
  const finalProgress = Math.min(Math.max(progress, 0), 100); // Clamp entre 0-100
  const finalIsLoading = isLoading;

  return (
    <CustomLoader
      progress={finalProgress}
      isLoading={finalIsLoading}
      error={finalError}
    />
  );
}
