import Card from "@/app/shared/components/Card";
import Icon from "@/assets/icons/Icon";
import { useTranslation } from "react-i18next";

export default function Profile() {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col md:flex-row gap-6 w-full max-w-5xl text-white">

            {/* 🪞 Información del usuario */}
            <Card.Container
                className="md:w-1/3 w-full flex flex-col items-center justify-between text-center px-8 py-10 bg-[var(--surface-subtle)] border border-[var(--border-subtle)]"
            >
                <div className="flex flex-col items-center gap-4">
                    <h2 className="text-lg font-semibold text-[var(--text-80)] mb-6">
                        {t("profile.title", { defaultValue: "Perfil" })}
                    </h2>

                    {/* Avatar */}
                    <div
                        className="w-28 h-28 rounded-full border-2 grid place-items-center"
                        style={{
                            borderColor: "var(--border-subtle)",
                            background: "linear-gradient(to bottom, var(--color-primary)20, var(--color-primary-dark)40)"
                        }}
                    >
                        <span className="text-4xl opacity-70">👤</span>
                    </div>

                    {/* Nombre / email */}
                    <div className="text-center">
                        <p className="text-sm" style={{ color: "var(--text-80)" }}>
                            {t("profile.name", { defaultValue: "Nombre Apellido" })}
                        </p>
                        <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                            {t("profile.email", { defaultValue: "usuario@ejemplo.com" })}
                        </p>
                    </div>

                    {/* 🔮 Pronombres / Género */}
                    <div className="mt-8 w-full">
                        <p className="text-xs text-gray-400 mb-3 text-center">
                            {t("profile.gender.label", { defaultValue: "Género:" })}
                        </p>

                        <div className="flex justify-center gap-4">
                            {(
                                [
                                    { icon: "male", label: t("profile.gender.male", { defaultValue: "Él" }) },
                                    { icon: "female", label: t("profile.gender.female", { defaultValue: "Ella" }) },
                                ] as const
                            ).map(({ icon, label }) => (
                                <div key={label} className="relative group">
                                    <button
                                        className="w-10 h-10 flex items-center justify-center rounded-full border transition-all"
                                        style={{
                                            background: "var(--surface-weak)",
                                            borderColor: "var(--border-subtle)",
                                        }}
                                    >
                                        <Icon name={icon} className="w-5 h-5 text-[var(--color-primary)]" />
                                    </button>

                                    {/* Tooltip */}
                                    <span
                                        className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-gray-300 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-all pointer-events-none"
                                    >
                                        {label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Botón guardar */}
                    <button
                        className="mt-5 mb-4 px-4 py-2 rounded-lg font-semibold text-sm transition cursor-pointer"
                        style={{
                            background: "linear-gradient(to right, var(--btn-primary-from), var(--btn-primary-to))",
                            boxShadow: "var(--btn-primary-glow)",
                        }}
                    >
                        {t("profile.save", { defaultValue: "Guardar Cambios" })}
                    </button>
                </div>
            </Card.Container>

            {/* Configuración de la IA */}
            <Card.Container
                className="flex-1 flex flex-col px-10 py-10 bg-[var(--surface-subtle)] border border-[var(--border-subtle)]"
            >
                <div className="flex flex-col items-center gap-4">
                    <h2 className="text-lg font-semibold text-[var(--text-80)] mb-6">
                        {t("profile.aiSettings.title", { defaultValue: "Configuración de la IA" })}
                    </h2>
                </div>

                {/* Estado emocional */}
                <div className="mb-8">
                    <p className="text-sm mb-3 text-purple-100/90">
                        {t("profile.aiSettings.emotions", { defaultValue: "Estados emocionales predominantes:" })}
                    </p>

                    <div className="flex flex-col gap-3">
                        {[
                            { emoji: "☁️", label: t("profile.aiSettings.calm", { defaultValue: "Calma" }), percent: 40 },
                            { emoji: "☀️", label: t("profile.aiSettings.happy", { defaultValue: "Felicidad" }), percent: 35 },
                            { emoji: "🌧️", label: t("profile.aiSettings.sad", { defaultValue: "Tristeza" }), percent: 25 },
                        ].map(({ emoji, label, percent }) => (
                            <div key={label}>
                                <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg">{emoji}</span>
                                        <p className="font-medium text-purple-200">{label}</p>
                                    </div>
                                    <span className="text-xs text-purple-300">{percent}%</span>
                                </div>

                                {/* Barra con colores del sistema */}
                                <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--surface-weak)" }}>
                                    <div
                                        className="h-full rounded-full transition-all duration-500"
                                        style={{
                                            width: `${percent}%`,
                                            background: "linear-gradient(to right, var(--color-timeline-progress-from), var(--color-timeline-progress-to))",
                                            boxShadow: "var(--color-timeline-progress-shadow)",
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Probabilidad de premonición */}
                <div className="mb-8">
                    <p className="text-sm mb-3 text-purple-100/90">
                        {t("profile.aiSettings.premonition", { defaultValue: "Probabilidad de premonición:" })}
                    </p>

                    <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                            <span className="text-lg">🔮</span>
                            <p className="font-medium text-purple-200">
                                {t("profile.aiSettings.sensitivity", { defaultValue: "Sensibilidad" })}
                            </p>
                        </div>
                        <span className="text-xs text-purple-300">25%</span>
                    </div>

                    <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--surface-weak)" }}>
                        <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                                width: "25%",
                                background: "linear-gradient(to right, var(--color-timeline-progress-from), var(--color-timeline-progress-to))",
                                boxShadow: "var(--color-timeline-progress-shadow)",
                            }}
                        />
                    </div>
                </div>

                {/* Tests */}
                <div className="flex flex-col items-center gap-4">
                    <h3 className="text-lg font-semibold text-[var(--text-80)] mb-3">
                        {t("profile.aiSettings.tests", { defaultValue: "Tests disponibles" })}
                    </h3>
                </div>

                <div className="flex flex-wrap justify-center gap-4 mb-5">
                    {(
                        [
                            { label: t("profile.tests.premonition", { defaultValue: "Premonition" }), icon: "premonition" },
                            { label: t("profile.tests.personality", { defaultValue: "Personality" }), icon: "personality" },
                            { label: t("profile.tests.appearance", { defaultValue: "Appearance" }), icon: "appearance" },
                        ] as const
                    ).map(({ label, icon }) => (
                        <button
                            key={label}
                            className="
                                group
                                flex flex-col items-center justify-center w-28 h-24 
                                rounded-xl border transition-all duration-300 cursor-pointer
                                bg-[var(--surface-weak)] border-[var(--border-subtle)]
                                hover:bg-[var(--color-primary)] hover:border-[var(--btn-primary-border)]
                                hover:shadow-[var(--btn-primary-glow)] hover:scale-[1.03]"
                        >
                            <Icon
                                name={icon}
                                className="w-6 h-6 mb-2 text-[var(--color-primary)] transition-colors duration-300 group-hover:text-white"
                            />
                            <span
                                className="text-xs text-center text-[var(--color-text-muted)] transition-colors duration-300 group-hover:text-white"
                            >
                                {label}
                            </span>
                        </button>
                    ))}
                </div>
            </Card.Container>
        </div>
    );
}
