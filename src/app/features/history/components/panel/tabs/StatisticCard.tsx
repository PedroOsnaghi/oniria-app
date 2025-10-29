type Metric = { label: string; value: number | string; sub?: string };
type StatItem = { title: string; label: string; hint: string; percent: number };

export default function StatisticCard({
    metrics = [
        { label: "interpretaciones", value: 25, sub: "S/ Logro: 45" },
        { label: "Esta semana", value: 2 },
        { label: "Compartidos", value: 16 },
    ],
    stats = [
        { title: "Porcentaje de sueños interpretados", label: "Sueños interpretados", hint: "(sueños interpretados / totales) x 100", percent: 80 },
        { title: "Porcentaje de emociones registradas", label: "Emociones registradas", hint: "(sueños con emociones / totales) x 100", percent: 42 },
        { title: "Porcentaje de sueños con imagen generada", label: "Imagen generada", hint: "(sueños con imagen / totales) x 100", percent: 80 },
    ],
}: {
    metrics?: Metric[];
    stats?: StatItem[];
}) {
    return (
        <div className="space-y-6">
            {/* Header de métricas */}
            <div className="rounded-2xl bg-zinc-900/70 ring-1 ring-white/10 p-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                    {metrics.map((m, i) => (
                        <div key={i} className="flex flex-col items-center">
                            <span className="text-xs text-zinc-300/80">{m.label}</span>
                            <span className="text-3xl leading-none mt-1 text-white">{m.value}</span>
                            {m.sub && <span className="mt-1 text-[11px] text-zinc-400">{m.sub}</span>}
                        </div>
                    ))}
                </div>
                <div className="mt-4 h-px w-full bg-white/10" />
            </div>

            {/* Lista de barras */}
            <div className="space-y-6">
                {stats.map((s, idx) => (
                    <div key={idx} className="space-y-2">
                        <p className="text-sm text-zinc-200">{s.title}</p>

                        {/* barra */}
                        <div className="rounded-sm bg-fuchsia-500 h-1" /> {/* línea superior fina del mockup */}
                        <div className="relative w-full rounded-md bg-zinc-900/70 ring-1 ring-white/10 overflow-hidden">
                            {/* fondo oscuro (track) */}
                            <div className="absolute inset-0 bg-black/30" aria-hidden />

                            {/* relleno con degradé */}
                            <div
                                className="relative h-10 overflow-hidden"
                                style={{ width: `${Math.min(Math.max(s.percent, 0), 100)}%` }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-600 via-violet-500 to-fuchsia-400" />
                                {/* label a la izquierda */}
                                <div className="relative h-full flex items-center pl-3">
                                    <span className="text-sm font-medium text-white">{s.label}</span>
                                </div>
                            </div>

                            {/* % a la derecha */}
                            <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                <span className="text-sm text-white/90">{s.percent}%</span>
                            </div>
                        </div>

                        <p className="text-[12px] text-zinc-400">{s.hint}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
