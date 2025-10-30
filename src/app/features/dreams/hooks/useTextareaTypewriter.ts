import { useRef } from "react";

export function useTextareaTypewriter() {
    const typingRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const typeInto = ({
        baseText,
        toType,
        onUpdate,
        speed = 40, // chars por segundo
        onFinish,
    }: {
        baseText: string;
        toType: string;
        onUpdate: (text: string) => void;
        speed?: number;
        onFinish?: () => void;
    }) => {
        // limpiar 
        if (typingRef.current) {
            clearInterval(typingRef.current);
            typingRef.current = null;
        }

        const cleanToType = toType.trim();
        if (!cleanToType) return;

        let currentIndex = 0;
        const interval = 1000 / speed;
        let currentText = baseText;

        typingRef.current = setInterval(() => {
            if (currentIndex < cleanToType.length) {
                currentText = currentText + cleanToType[currentIndex];
                onUpdate(currentText);
                currentIndex++;
            } else {
                if (typingRef.current) {
                    clearInterval(typingRef.current);
                    typingRef.current = null;
                }
                onFinish?.();
            }
        }, interval);
    };

    return { typeInto };
}
