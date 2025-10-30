import { useRef, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { TranscriptionService } from "../services/transcription.service";

type UseVoiceToTextProps = {
    onTranscribed?: (text: string) => void;
    session?: Session | null;
};

export function useVoiceToText({
    onTranscribed,
    session,
}: UseVoiceToTextProps = {}) {
    const [isRecording, setIsRecording] = useState(false);
    const [isTranscribing, setIsTranscribing] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const transcriptionServiceRef = useRef(new TranscriptionService());

    const sendAudioToBackend = async (audioBlob: Blob) => {
        setIsTranscribing(true);
        try {
            const text = await transcriptionServiceRef.current.transcriptionDream(
                session ?? null,
                audioBlob
            );

            console.log("[useVoiceToText] texto transcripto:", text);

            if (text && onTranscribed) {
                onTranscribed(text);
            }
        } catch (err) {
            console.error("Error enviando audio al backend:", err);
        } finally {
            setIsTranscribing(false);
        }
    };

    const handleToggleRecording = async () => {
        if (isRecording) {
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
