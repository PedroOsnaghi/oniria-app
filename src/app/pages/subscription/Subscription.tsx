import HudSystem from "@/app/features/hud/components/Hudsystem";
import HeaderLogo from "@/app/features/logo/HeaderLogo";
import CardForm from "@/app/features/payment/components/CardForm";
import supabase from "@/app/utils/supabase";
import type { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function Subscription() {
  const { t } = useTranslation();
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
  }, []);

  if (!session) {
    return (
      <div className="flex justify-center items-center h-screen text-white">
        {t("subscription.loginToContinue")}
      </div>
    );
  }

  return (
    <div>
      <HudSystem.TopBar>
        <HeaderLogo text={"Oniria"} onClick={ () => navigate("/")}/>
      </HudSystem.TopBar>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-white px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-gray-900/60 backdrop-blur-xl rounded-2xl shadow-xl w-full max-w-5xl border border-gray-800 overflow-hidden mt-5">
          <div className="p-8 flex flex-col justify-between">
            <div>
              <h2 className="text-3xl font-semibold mb-2">
                {t("subscription.upgradeTitle")}
              </h2>
              <p className="text-gray-400 mb-8">
                {t("subscription.upgradeSubtitle")}
              </p>

              <ul className="space-y-5 text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-fuchsia-400 text-lg mt-1">✓</span>
                  <div>
                    <p className="font-medium">
                      {t("subscription.feature1Title")}
                    </p>
                    <p className="text-sm text-gray-500">
                      {t("subscription.feature1Desc")}
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <span className="text-fuchsia-400 text-lg mt-1">✓</span>
                  <div>
                    <p className="font-medium">
                      {t("subscription.feature2Title")}
                    </p>
                    <p className="text-sm text-gray-500">
                      {t("subscription.feature2Desc")}
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <span className="text-fuchsia-400 text-lg mt-1">✓</span>
                  <div>
                    <p className="font-medium">
                      {t("subscription.feature5Title")}
                    </p>
                    <p className="text-sm text-gray-500">
                      {t("subscription.feature5Desc")}
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <span className="text-fuchsia-400 text-lg mt-1">✓</span>
                  <div>
                    <p className="font-medium">
                      {t("subscription.feature3Title")}
                    </p>
                    <p className="text-sm text-gray-500">
                      {t("subscription.feature3Desc")}
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <span className="text-fuchsia-400 text-lg mt-1">✓</span>
                  <div>
                    <p className="font-medium">
                      {t("subscription.feature4Title")}
                    </p>
                    <p className="text-sm text-gray-500">
                      {t("subscription.feature4Desc")}
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="pt-8 mt-8 border-t border-gray-800 text-sm text-gray-500">
              {t("subscription.agreementText")}{" "}
              <a href="#" className="text-fuchsia-400 hover:underline">
                {t("subscription.terms")}
              </a>{" "}
              {t("subscription.and")}{" "}
              <a href="#" className="text-fuchsia-400 hover:underline">
                {t("subscription.privacy")}
              </a>
              .
            </div>
          </div>

          <div className="p-8 bg-gray-950/60 border-l border-gray-800 flex flex-col justify-center">
            <h3 className="text-xl font-semibold mb-6 text-center">
              {t("subscription.confirmPlan")}
            </h3>
            <div className="bg-gray-800/50 rounded-xl p-4 mb-6">
              <p className="flex justify-between text-sm text-gray-400">
                <span>{t("subscription.planName")}</span>
                <span className="text-gray-200 font-medium">
                  {t("subscription.planPrice")}
                </span>
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {t("subscription.billingInfo")}
              </p>
            </div>

            <CardForm
              amount={10000}
              description={t("subscription.planDescription")}
              type="membership"
              session={session}
              onSuccess={() => {}}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
