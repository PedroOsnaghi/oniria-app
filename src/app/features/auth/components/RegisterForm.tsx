import { useState } from "react";
import Button from "../../../../shared/components/Button";
import { useTranslation } from "react-i18next";
import { useAuth } from "@features/auth/hooks/useAuth";

export default function RegisterForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const { t } = useTranslation();
  const { signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError(
        t("register.errorPasswordMatch", {
          defaultValue: "Las contraseñas no coinciden",
        })
      );
      return;
    }

    const { error } = await signUp(email, password, username);
    if (error) {
      console.error(error);
      setError(t("register.error", { defaultValue: "Error al registrarse" }));
    } else {
      setIsSuccess(true);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder={t("register.username")}
          className="w-full px-4 py-2 rounded-lg bg-black/40 border border-white/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("register.email")}
          className="w-full px-4 py-2 rounded-lg bg-black/40 border border-white/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t("register.password")}
          className="w-full px-4 py-2 rounded-lg bg-black/40 border border-white/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder={t("register.confirmPassword")}
          className="w-full px-4 py-2 rounded-lg bg-black/40 border border-white/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button type="submit">{t("register.button")}</Button>
      </form>

      {isSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          
          <div className="relative rounded-2xl border border-white/20 bg-gradient-to-b from-black/40 via-purple-800/60 to-purple-500/40 backdrop-blur-md shadow-2xl p-8 max-w-md w-full">
            <div className="w-16 h-16 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>

            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-3">
                {t("register.successTitle", { defaultValue: "¡Registro Exitoso!" })}
              </h3>
              <p className="text-gray-200 mb-6">
                {t("register.success", {
                  defaultValue:
                    "Revisa tu email para verificar la cuenta.",
                })}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}