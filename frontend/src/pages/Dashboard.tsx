import React from "react";
import { SOSButton } from "../components/SOSButton";
import { useTranslation } from "react-i18next";

export const Dashboard: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <section className="rounded-lg bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold mb-2">{t("pages.dashboard")}</h1>
        <p className="text-sm text-slate-600">
          Use the SOS button below in case of an emergency. Your emergency contacts will be notified.
        </p>
      </section>
      <section className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-3">{t("sos.trigger")}</h2>
        <SOSButton />
      </section>
    </div>
  );
};
