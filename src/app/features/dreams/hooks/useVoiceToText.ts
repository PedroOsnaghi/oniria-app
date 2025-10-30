import { useRef, useState } from "react";

type UseVoiceToTextProps = {
    onTranscribed?: (text: string) => void;
    endpoint?: string;
};

export function useVoiceToText({
    onTranscribed,
    endpoint = "/api/dreams/transcribe",
}: UseVoiceToTextProps = {}) {
    const [isRecording, setIsRecording] = useState(false);
    const [isTranscribing, setIsTranscribing] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    const sendAudioToBackend = async (audioBlob: Blob) => {
        setIsTranscribing(true);
        try {
            console.log("[useVoiceToText] enviando blob al back:", {
                size: audioBlob.size,
                type: audioBlob.type,
            });
            const formData = new FormData();
            formData.append("audio", audioBlob, "dream-audio.webm");

            const res = await fetch(endpoint, {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                throw new Error("Error transcribiendo audio");
            }

            const data = await res.json();
            const transcribedText = data?.text ?? "";

            console.log("[useVoiceToText] respuesta del back:", data);

            if (transcribedText && onTranscribed) {
                onTranscribed(transcribedText);
            }
        } catch (err) {
            console.error("Error enviando audio al backend:", err);
        } finally {
            setIsTranscribing(false);
        }
    };

    const handleToggleRecording = async () => {
        if (isRecording) {
            // parar grabación
            console.log("[useVoiceToText] stop recording");
            mediaRecorderRef.current?.stop();
            setIsRecording(false);
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: "audio/webm",
            });
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = async () => {
                // blob con el mime correcto
                const blob = new Blob(chunksRef.current, { type: "audio/webm" });
                console.log("[useVoiceToText] grabación finalizada. Blob armado:", {
                    size: blob.size,
                    type: blob.type,
                    chunks: chunksRef.current.length,
                });
                await sendAudioToBackend(blob);
                stream.getTracks().forEach((t) => t.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (err) {
            console.error("No se pudo acceder al micrófono:", err);
        }
    };

    return {
        isRecording,
        isTranscribing,
        handleToggleRecording,
    };
}
