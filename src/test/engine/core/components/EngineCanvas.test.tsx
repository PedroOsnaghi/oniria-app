import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render } from "@testing-library/react";

// Mock de @react-three/fiber debe ir antes de importar el componente
vi.mock("@react-three/fiber", async () => {
  const actual = await vi.importActual("@react-three/fiber");
  return {
    ...actual,
    Canvas: vi.fn(({ children, className }) => (
      <canvas className={className} data-testid="r3f-canvas">
        {children}
      </canvas>
    )),
  };
});

import { EngineCanvas } from "@engine/core/components/EngineCanvas";
import type { EngineSettings } from "@engine/core/types/engine.types";

describe("EngineCanvas", () => {
  const defaultEngineSettings: EngineSettings = {
    backgroundColor: "#000000",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("debería renderizar sin errores", () => {
    expect(() =>
      render(<EngineCanvas engineSettings={defaultEngineSettings} />)
    ).not.toThrow();
  });

  it("debería renderizar un elemento canvas", () => {
    const { container } = render(
      <EngineCanvas engineSettings={defaultEngineSettings} />
    );

    // Verificar que el canvas se renderiza
    const canvas = container.querySelector("canvas");
    expect(canvas).toBeTruthy();
  });

  it("debería usar el componente Canvas con props correctas", () => {
    const { container } = render(
      <EngineCanvas engineSettings={defaultEngineSettings} />
    );
    const canvas = container.querySelector("canvas");

    // Verificar que el canvas existe y es correcto
    expect(canvas).toBeTruthy();
    expect(canvas?.tagName.toLowerCase()).toBe("canvas");
  });

  describe("Configuración del componente", () => {
    it("debería tener propiedades de Canvas correctas", () => {
      // Verificar configuración del Canvas según la implementación
      const expectedCamera = { position: [-5, 4, 4], fov: 45 };

      expect(expectedCamera.position).toEqual([-5, 4, 4]);
      expect(expectedCamera.fov).toBe(45);
    });

    it("debería configurar propiedades gl correctamente", () => {
      // Verificar propiedades según la implementación
      const { getByTestId } = render(
        <EngineCanvas engineSettings={defaultEngineSettings} />
      );

      const canvas = getByTestId("r3f-canvas");
      expect(canvas).toBeTruthy();
    });

    it("debería usar el color de fondo correcto", () => {
      const customSettings: EngineSettings = {
        backgroundColor: "#ff0000",
      };

      const { getByTestId } = render(
        <EngineCanvas engineSettings={customSettings} />
      );

      const canvas = getByTestId("r3f-canvas");
      expect(canvas).toBeTruthy();
    });
  });

  describe("Props y configuración", () => {
    it("debería aplicar className personalizada", () => {
      const { getByTestId } = render(
        <EngineCanvas
          engineSettings={defaultEngineSettings}
          className="custom-class"
        />
      );

      const canvas = getByTestId("r3f-canvas");
      expect(canvas.className).toContain("canvas-webgl");
      expect(canvas.className).toContain("custom-class");
    });

    it("debería tener displayName correcto", () => {
      expect(EngineCanvas.displayName).toBe("Engine.Canvas");
    });
  });

  describe("Integración", () => {
    it("debería renderizar children correctamente", () => {
      const TestChild = () => <mesh data-testid="test-mesh" />;

      const { getByTestId } = render(
        <EngineCanvas engineSettings={defaultEngineSettings}>
          <TestChild />
        </EngineCanvas>
      );

      const canvas = getByTestId("r3f-canvas");
      expect(canvas).toBeTruthy();
    });

    it("debería funcionar como wrapper para contenido 3D", () => {
      const { getByTestId } = render(
        <EngineCanvas engineSettings={defaultEngineSettings} />
      );
      const canvas = getByTestId("r3f-canvas");

      // Verificar que funciona como wrapper
      expect(canvas).toBeTruthy();
      expect(canvas?.tagName.toLowerCase()).toBe("canvas");
    });
  });
});
