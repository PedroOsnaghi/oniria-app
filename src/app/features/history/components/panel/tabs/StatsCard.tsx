type Emotion = { name: string; value: number };
type Props = {
    emotions?: Emotion[];
    classes?: string[];
    typeProb?: number;
    entities?: string[];
    title?: string;
};

function ProgressBar({ value }: { value: number }) {
    const v = Math.max(0, Math.min(100, value));
    return (
        <div className="w-full h-3 rounded-full bg-zinc-800 overflow-hidden">
            <div
                className="h-full bg-gradient-to-r from-fuchsia-600 via-violet-500 to-fuchsia-400"
                style={{ width: `${v}%` }}
            />
        </div>
    );
}

function Chip({ children }: { children: React.ReactNode }) {
    return (
        <span className="px-3 py-1 rounded-full text-sm bg-zinc-800 text-zinc-100/90">
            {children}
        </span>
    );
}

export default function StatsCard({
    emotions = [
        { name: "Alegría", value: 62 },
        { name: "Nostalgia", value: 38 },
        { name: "Calma", value: 27 },
    ],
    classes = ["Normal", "Lúcido", "Pesadilla", "Simbólico"],
    typeProb = 48,
    entities = ["Bosque", "Niño", "Escuela"],
}: Props) {
    return (
        <div className="rounded-3xl bg-zinc-900/70 ring-1 ring-white/10 p-5 text-zinc-100 space-y-5">

            {/* Emociones predominantes */}
            <section className="space-y-3">
                <h4 className="text-sm font-semibold text-zinc-200">Emociones predominantes</h4>
                <div className="space-y-3">
                    {emotions.map((e) => (
                        <div key={e.name} className="space-y-1">
                            <ProgressBar value={e.value} />
                        </div>
                    ))}
                </div>
            </section>

            {/* Clasificación */}
            <section className="space-y-2 pt-2">
                <h4 className="text-sm font-semibold text-zinc-200">Clasificación</h4>
                <ul className="text-base leading-7 text-zinc-200/90">
                    {classes.map((c) => (
                        <li key={c}>{c}</li>
                    ))}
                </ul>
            </section>

            {/* Probabilidad de tipo */}
            <section className="space-y-3 pt-2">
                <h4 className="text-sm font-semibold text-zinc-200">Probabilidad de tipo: Prediccion</h4>
                <ProgressBar value={typeProb} />
            </section>

            {/* Lugares / Personas */}
            <section className="space-y-3 pt-2">
                <h4 className="text-sm font-semibold text-zinc-200">Lugares / Personas</h4>
                <div className="flex flex-wrap gap-2">
                    {entities.map((e) => (
                        <Chip key={e}>{e}</Chip>
                    ))}
                </div>
            </section>
        </div>
    );
}
