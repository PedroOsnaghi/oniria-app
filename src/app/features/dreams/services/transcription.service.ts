import type { Session } from "@supabase/supabase-js";

export class TranscriptionService {
    async transcriptionDream(session: Session | null, audioBlob: Blob): Promise<string> {
        
        if (!session?.access_token) {
            throw new Error("No authentication token available");
        }

        const formData = new FormData();
        formData.append("audio", audioBlob, "dream-audio.webm");

        const response = await fetch("http://localhost:3000/api/dreams/transcribe", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${session.access_token}`,
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Error transcribiendo audio: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const transcribedText = data?.text ?? "";
        return transcribedText;
    }
}
